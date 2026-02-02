const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
require('dotenv/config')
const { Kafka } = require('kafkajs');

const s3client = new S3Client({
    region : "ap-south-1",
    credentials : {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    }
})

const PROJECT_ID = process.env.PROJECT_ID;
const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID;
const DOMAIN_NAME = process.env.DOMAIN_NAME;

const USERNAME = process.env.USERNAME 
const BROKERS = process.env.BROKERS 

console.log("deveployment id : ",DEPLOYMENT_ID);

const kafka = new Kafka({
    clientId : `docker-build-server-${PROJECT_ID}`,
    brokers : [`${BROKERS}`],
    ssl : {
        ca : [fs.readFileSync(path.join(__dirname, 'kafka.pem'), 'utf-8')]
    },
    sasl : {
        username : USERNAME,
        password : process.env.AIVEN_PASSWORD,
        mechanism : 'plain'
    }
})

console.log("kafka : ",kafka);

const producer = kafka.producer();

console.log("producer : ", producer)

async function PublishLogs(log){

    console.log("log : ",log)

    const res =  await producer.send({
        topic : `container-logs`,
        messages : [
            {
                key : "log",
                value : JSON.stringify({
                    PROJECT_ID,
                    DEPLOYMENT_ID,
                    log
                })
            }
        ]
    })

}

async function init() {

    try { 
        await producer.connect();
        await PublishLogs("executing")
        const filepath = path.join(__dirname,"output")
        await PublishLogs(`filepath : ${filepath}`)
        let buildcmd = "npm run build";
    
        const vitepath = path.join(filepath,"vite.config.js");
        const vitpath2 = path.join(filepath,"vite.config.ts");
        
        if(fs.existsSync(vitepath) || fs.existsSync(vitpath2)){
            buildcmd = "npx vite build --base=./"
        }
        await PublishLogs(`buildcmd : ${buildcmd}`)
        const p = exec(`cd ${filepath} && npm install && ${buildcmd}`)
    
        p.stdout?.on("data",async function(data){
            console.log(data.toString())
            await PublishLogs(data.toString())
        })
    
        p.stdout?.on("error",async (data) => {
            console.log('Error', data.toString())
            PublishLogs(`error: ${data.toString()}`)
        });
    
        p?.on("close",async function (){    
            await PublishLogs(`Build Complete`)
            const buildfolderPath = path.join(__dirname,"output","dist");
            await PublishLogs(`buildFolderpath : ${buildfolderPath}`);
            const files = fs.readdirSync(buildfolderPath,{recursive : true})
            await PublishLogs(`files : ${files}`)
    
            for(const file of files){
                
                await PublishLogs(`file : ${file}`)
                const filepath = path.join(buildfolderPath, file);
    
                await PublishLogs(`filepath: ${filepath}`)
    
                if(fs.lstatSync(filepath).isDirectory()) continue;
                await PublishLogs(`mime : ${mime.lookup(file)}`);
    
                const s3Key = file.replace(/\\/g, '/')
    
                const command = new PutObjectCommand({
                    Bucket : 'vercel-system',
                    Key : `__outputs/${DOMAIN_NAME}/${s3Key}`,
                    Body : fs.createReadStream(filepath),
                    ContentType : mime.lookup(filepath)
                })
    
                await s3client.send(command);
                await PublishLogs(`uploaded : ${file}`);
            }
    
            await PublishLogs("DEPLOYMENT_DONE:SUCCESS")
            await producer.disconnect()
            process.exit(0)
        })
    } catch (error) {
        await PublishLogs(`DEPLOYMENT_DONE:FAILED`)
        process.exit(1)
    }
}

init()