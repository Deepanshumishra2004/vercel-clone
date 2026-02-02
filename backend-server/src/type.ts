import * as z from "zod";

enum DeploymentStatus {
    NOT_STARTED,
    QUEUED,
    IN_PROGRESS,
    READY,
    FAIL
}

const SignupSchema = z.object({
    username : z.string(),
    email : z.string().email(),
    password : z.string()
})

const SigninSchema = z.object({
    email : z.string().email(),
    password : z.string()
})

const ProjectSchema = z.object({
    name : z.string(),
    gitUrl : z.string(),
    subDomain : z.string(),
    customDomain : z.string().optional()
})

const DeploymentSchema = z.object({
    projectId : z.string(),
})


export { SigninSchema, SignupSchema, ProjectSchema, DeploymentSchema };