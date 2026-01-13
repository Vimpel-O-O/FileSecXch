import { S3Client } from "@aws-sdk/client-s3";

function getEnvVariable(key:string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export const s3Client = new S3Client({
    region: getEnvVariable("AWS_REGION"), 
    credentials: {
        accessKeyId: getEnvVariable("AWS_ACCESS_KEY_ID"), 
        secretAccessKey: getEnvVariable("AWS_SECRET_ACCESS_KEY"),
    }
});

export const BUCKET_NAME = getEnvVariable("AWS_S3_BUCKET_NAME");

export async function main() {
    return s3Client;
}