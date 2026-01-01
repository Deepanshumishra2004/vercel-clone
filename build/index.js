const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
require('dotenv/config')

const s3client = new S3Client({
    region : "ap-south-1",
    credentials : {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    }
})

async function init() {
    console.log("executing")
    const filepath = path.join(__dirname,"output")
    console.log("filepath : ",filepath)
    let buildcmd = "npm run build";

    const vitepath = path.join(filepath,"vite.config.js");
    const vitpath2 = path.join(filepath,"vite.config.ts");

    console.log("find : ",vitepath);

    if(fs.existsSync(vitepath) || fs.existsSync(vitpath2)){
        console.log("----------------------------------------------------");
        buildcmd = "npx vite build --base=./"
    }
    console.log("buildcmd : ",buildcmd)
    const p = exec(`cd ${filepath} && npm install && ${buildcmd}`)

    const PROJECT_ID = process.env.PROJECT_ID;

    console.log(PROJECT_ID);

    p.stdout?.on("data",function(data){
        console.log(data.toString())
    })

    p.stderr?.on("data", (data) => {
        console.error(data.toString());
    });

    p?.on("close",async (code)=>{
        console.log("build completed", code)

        const buildfolderPath = path.join(__dirname,"output","dist");
        console.log("buildFolderpath : ",buildfolderPath);
        const files = fs.readdirSync(buildfolderPath,{recursive : true})
        console.log("files : ",files)
        for(const file of files){
            console.log("file : ",file)
            const filepath = path.join(buildfolderPath, file);
            console.log("filepath : ",filepath);
            if(fs.lstatSync(filepath).isDirectory()) continue;

            console.log("mime : ",mime.lookup(file));

            const s3Key = file.replace(/\\/g, '/')

            const command = new PutObjectCommand({
                Bucket : 'vercel-system',
                Key : `__outputs/${PROJECT_ID}/${s3Key}`,
                Body : fs.createReadStream(filepath),
                ContentType : mime.lookup(filepath)
            })
            await s3client.send(command);

            console.log("uploaded : ",file);
        }

        console.log("Done...");
    })
}

init()