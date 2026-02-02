import express from "express";
import fs from "fs";
import Mustache from "mustache";
import * as k8s from "@kubernetes/client-node";
import yaml from "js-yaml";
import { Kafka } from "kafkajs";
import path from "path";
import { DeploymentSchema, ProjectSchema, SigninSchema, SignupSchema } from "./type.js";

import { prisma } from "./index.js";
import { UserMiddleware } from "./middleware.js";
import Jwt from "jsonwebtoken";
import { BASEURL, jwtsecret } from "./config.js";
import bcrypt from "bcrypt";
import { createClient } from "@clickhouse/client";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(express.json());
app.use(cors());

const template = fs.readFileSync("./kubernetes/jobs.yml", "utf-8");

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const batchApi = kc.makeApiClient(k8s.BatchV1Api)

const kafkaPemPath = path.join(__dirname, "../kafka.pem");

const client = createClient({
    host: process.env.HOST,
    database: 'default',
    username: 'avnadmin',
    password: process.env.CLICKHOUSE_PASSWORD!
})

const kafka = new Kafka({
    clientId: 'api-server',
    brokers: ['kafka-vercel-deepanshumishra2004-5f44.i.aivencloud.com:16201'],
    ssl: {
        ca: [fs.readFileSync(kafkaPemPath, "utf-8")],
    },
    sasl: {
        username: 'avnadmin',
        password: process.env.KAFKA_PASSWORD!,
        mechanism: 'plain'
    }
})

console.log("kafka : ", kafka);

const consumer = kafka.consumer({
    groupId: 'api-server-logs-consumer'
})

app.post('/signup', async (req, res) => {

    const data = SignupSchema.safeParse(req.body);

    if (!data.success) return res.status(401).json({ message: "invalid credentials" })

    const { email, username, password } = data.data;
    const newpassword = await bcrypt.hash(password, 10);

    const isExist = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (isExist) return res.status(401).json({ message: "user already exists" })

    const response = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: newpassword
        }
    })

    res.json({
        message: "signup sucess",
        id: response.id
    })
})

app.post('/signin', async (req, res) => {
    const data = SigninSchema.safeParse(req.body);

    if (!data.success) return res.status(401).json({ message: "invalid credentials" })

    const { email, password } = data.data;

    try {
        const isExist = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!isExist) return res.status(401).json("user doesn't exist")

        const isValid = await bcrypt.compare(password, isExist.password);

        if (!isValid) return res.status(401).json({ message: 'invalid password' })

        const token = Jwt.sign({
            userId: isExist.id,
        }, jwtsecret)

        res.json({
            token,
            data : { 
                id : isExist.id,
                email : isExist.email,
                username : isExist.username
             }
        })

    } catch (error) {
        res.status(401).json({
            message: "signin fails"
        })
    }
})

app.post('/project', UserMiddleware, async (req, res) => {
    console.log("requrest : ",req.body);
    const data = ProjectSchema.safeParse(req.body);

    if (!data.success) return res.status(401).json({
        message: "invalid credential"
    })

    const { name, gitUrl, subDomain, customDomain } = data.data;

    const userId = (req as any).userId;

    const reponse = await prisma.project.create({
        data: {
            userId: userId,
            name: name,
            gitUrl: gitUrl,
            subDomain: subDomain,
            customDomain: customDomain!
        }
    })

    return res.json({
        message: "project sucess register",
        project: reponse
    })

})


app.get('/project/:id',UserMiddleware,async(req,res)=>{
    const id = req.params.id;

    const userId = (req as any).userId;

    const response = await prisma.project.findFirst({
        where : {
            id : id!,
            userId : userId
        }
    })


    res.json({
        data : {
            response
        }
    })

})

app.get('/projects',UserMiddleware,async(req,res)=>{

    const userId = (req as any).userId;

    const response = await prisma.project.findMany({
        where : {
            userId : userId
        }
    })


    res.json({ response })

})

app.get('/deploy/:id',UserMiddleware,async(req,res)=>{

    const projectId = req.params.id;

    const userId = (req as any).userId;

    const response = await prisma.deployment.findMany({
        where : {
            projectId : projectId!,
            userId : userId
        }
    })

    res.json({ response })

})


app.post('/deploy', UserMiddleware, async (req, res) => {

    const data = DeploymentSchema.safeParse(req.body);


    if (!data.success) return res.status(401).json({
        message: "invalid credential"
    })
    console.log("data : ",data.data);
    const { projectId } = data.data;

    const userId = (req as any).userId;

    const response = await prisma.project.findFirst({
        where: {
            id: projectId
        }
    })

    if (!response) return res.status(401).json({
        message: "project doesn't exist"
    })

    const subDomain = response.subDomain;

    const checkExistingDeployment = await prisma.deployment.findFirst({
        where: {
            projectId: projectId,
            status: {
                in: ["IN_PROGRESS", "QUEUED"]
            }
        }
    })

    if (checkExistingDeployment)
        return res.status(401).json({
            message: "deployment already in progress"
        })

    const deployment = await prisma.deployment.create({
        data: {
            userId: userId,
            projectId: response.id,
            status: "QUEUED"
        }
    })


    const safeName = (value: string) =>
        value
          .toLowerCase()
          .replace(/[^a-z0-9.-]/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 63);
      
    try {
        console.log("gitYrl : ", response.gitUrl);
        const jobYaml = Mustache.render(template, {
            PROJECT_ID: safeName(`${projectId}-${response.name}`),
            DEPLOYMENT_ID: deployment.id,
            GIT_REPO: response.gitUrl,
            DOMAIN_NAME: `${deployment.id}${response.subDomain}`
        })

        const job = yaml.load(jobYaml) as k8s.V1Job;
        await batchApi.createNamespacedJob({
            namespace: "default",
            body: job
        });

        const data = await prisma.deployment.update({
            where : {
                userId : userId,
                id : deployment.id
            },
            data : {
                Url : `http://${deployment.id!}${subDomain}.localhost:8000`
            }
        })

        res.json({
            message: "building started",
            id: deployment.id,
            url: `http://${deployment.id!}${subDomain}.localhost:8000`
        })

    } catch (error) {
        res.status(500).json({
            error: "failed to started build",
            detail: error
        })
    }
})

app.get("/deployment/:id", UserMiddleware, async (req, res) => {
    const id = req.params.id;
    console.log("id : ",id);
    const userId = (req as any).userId;

    const deployment = await prisma.deployment.findFirst({
        where: {
            id: id!,
            userId: userId
        }
    })

    console.log(deployment);

    if (!deployment) return res.status(401).json({ message: "the deployment doesn't exist" })

    const logs = await client.query({
        query: `
              SELECT event_id, deployment_id, log, timestamp
              FROM log_events
              WHERE deployment_id = {deployment_id:String}
              ORDER BY timestamp ASC
            `,
        query_params: {
            deployment_id: deployment.id
        },
        format: "JSONEachRow"
    })

    const rawlogs = await logs.json();
    console.log("logs : ", rawlogs);

    return res.json({ logs: rawlogs })

})

async function initKafkaConsumer() {
    await consumer.connect();

    await consumer.subscribe({
        topics: ["container-logs"]
    })

    await consumer.run({
        autoCommit: false,
        eachBatch: async function ({ batch, heartbeat, commitOffsetsIfNecessary, resolveOffset }) {

            const messages = batch.messages;

            console.log(`Recv. ${messages.length}  messages....`)
            for (const message of messages) {

                const stringMessage = message.value?.toString();
                console.log(`message : ${stringMessage}`)
                const { PROJECT_ID, DEPLOYMENT_ID, log } = JSON.parse(stringMessage!)
                console.log("deployment Id : ", DEPLOYMENT_ID)
                try {
                    const deployment_id = DEPLOYMENT_ID;
                    const { query_id } = await client.insert({
                        table: "log_events",
                        values: [{
                            event_id: uuidv4(),
                            deployment_id: deployment_id,
                            log: log
                        }],
                        format: "JSONEachRow"
                    })

                    console.log(query_id);


                    if (log === "DEPLOYMENT_DONE:SUCCESS") {
                        await prisma.deployment.update({
                            where: {
                                id: DEPLOYMENT_ID
                            },
                            data: {
                                status: "READY"
                            }
                        })
                    } else if (log === "DEPLOYMENT_DONE:FAILED") {
                        await prisma.deployment.update({
                            where: {
                                id: DEPLOYMENT_ID,
                            },
                            data: {
                                status: "FAIL"
                            }
                        })
                    }

                    resolveOffset(message.offset);
                    await commitOffsetsIfNecessary();
                    await heartbeat();

                } catch (error) {
                    console.error("Deployment update failed", error)
                }

            }
        }
    })
}

initKafkaConsumer();

app.listen(3001, () => {
    console.log("listening to port 3001")
})
