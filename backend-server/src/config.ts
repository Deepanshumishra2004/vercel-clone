export const jwtsecret = 'deepV1';
export const BASEURL = "https://vercel-system.s3.ap-south-1.amazonaws.com/__outputs";

export type DeploymentStatus = {
    status :   'NOT_STARTED' | 'QUEUED' | 'IN_PROGRESS' | 'READY' | 'FAIL';
}