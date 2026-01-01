import express from "express";
import fs from "fs";
import Mustache from "mustache";
import * as k8s from "@kubernetes/client-node";
import yaml from "js-yaml";

const template = fs.readFileSync("./kubernetes/jobs.yml","utf-8");

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const batchApi = kc.makeApiClient(k8s.BatchV1Api)

const app = express();
app.use(express.json());

app.post('/deploy',async(req,res)=>{
    const { gitUrl } = req.body;
    try {
        console.log("gitYrl : ",gitUrl);
        const jobYaml = Mustache.render(template,{
            PROJECT_ID : `id-${Date.now()}`,
            GIT_REPO : gitUrl as string
        })
    
        const job = yaml.load(jobYaml) as k8s.V1Job;
        await batchApi.createNamespacedJob({
            namespace : "default", 
            body : job
        });
    
        res.json({
            message : "building started",
        })
    } catch (error) {
        res.status(500).json({
            error : "failed to started build",
            detail : error
        })
    }
})

app.listen(3001,()=>{
    console.log("listening to port 3001")
})