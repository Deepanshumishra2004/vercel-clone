import Jwt, { type JwtPayload } from "jsonwebtoken";
import { jwtsecret } from "./config.js";
import type { NextFunction, Request, Response } from "express";

interface AuthRequest extends Request {
    userId? : string;
}


interface ReJWT extends JwtPayload {
    userId : string;
}

export function UserMiddleware(req : AuthRequest, res : Response, next : NextFunction){

    const token = req.headers.authorization?.split(' ')[1] as string;

    console.log("token : ",token);

    if(!token) return res.status(401).json({ message : "token doesn;t exist" })
    try {

    const deploy = Jwt.verify(token, jwtsecret) as ReJWT; 
    console.log(deploy)
    if(deploy && deploy.userId){
        req.userId = deploy.userId
        next();
    }
    } catch (error) {
        res.status(401).json({ message : "authonitcation fails" })
    }
}