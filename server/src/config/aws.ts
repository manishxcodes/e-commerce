import { S3Client } from "@aws-sdk/client-s3";
import { AppError } from "utils/AppError.ts";

const aws_bucket_name = process.env.AWS_BUCKET_NAME;
const aws_bucket_region = process.env.AWS_BUCKET_REGION;
const aws_access_key = process.env.AWS_ACCESS_KEY;
const aws_secret_key = process.env.AWS_SECRET_KEY;

if(!aws_bucket_name || !aws_bucket_region || !aws_access_key || !aws_secret_key) {
    throw new AppError("Missing aws env. variables");
}

export const s3 = new S3Client({
    region: aws_bucket_region,
    credentials: {
        accessKeyId: aws_access_key,
        secretAccessKey: aws_secret_key
    }
})

