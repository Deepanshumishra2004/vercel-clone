import express from "express";
import { BASEURL, PORT } from "./config.js";
import httpProxy from "http-proxy";

const app =express();

app.use(express.json());

const proxy = httpProxy.createProxy();

app.use((req,res)=>{

    const hostname = req.hostname;

    const subdomain = hostname.split('.')[0];
    console.log("subdomain : ",subdomain)
    let resolveTo = `${BASEURL}/${subdomain}`;
    console.log("resolveTo : ",resolveTo);

    if(req.url === '/'){
        req.url += '/index.html';
    }

    return proxy.web(req,res , {
        target : resolveTo,
        changeOrigin : true
    })

})

app.listen(PORT, ()=>{
    console.log(`server listing to port 8000`)
})