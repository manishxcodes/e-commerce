import { PutObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "config/aws.ts";

import { AppError } from "./AppError.ts";
import { customAlphabet } from "nanoid";

function generateRandomString():string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const nanoid = customAlphabet(chars, 10);
    return nanoid();
}

// add image to s3
export const uploadToS3 = async(file: Express.Multer.File, folder: string) => {
    if(!file) throw new AppError("File is missing", 400);

    // get bucket name 
    const bucketName = process.env.AWS_BUCKET_NAME;
    if(!bucketName) throw new AppError("Invalid / missing bucket name");

    const imageKey = `products/${Date.now()}-${file.originalname}-${generateRandomString()}`;

    const params = {
        Bucket: bucketName,
        Key: imageKey,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    // send to s3
    try {
        await s3.send(new PutObjectCommand(params));
    } catch(err) {
        console.log("s3 upload error: ", {details: err});
        throw new AppError("Failed to upload image to s3", 500);
    }

    return imageKey;
}

// delete image from s3
export const deleteFromS3 = async (imageKey: string) => {
    if(!imageKey) throw new AppError("Can't delete. Key is missing", 400);

    const bucketName = process.env.AWS_BUCKET_NAME;
    if(!bucketName) throw new AppError("Invalid / missing bucket name");

    try {
        await s3.send(
            new DeleteObjectCommand({
                Bucket: bucketName,
                Key: imageKey
            })
        );

    } catch(err) {
        console.log("Failed to delete image from s3:", {details: err});
        throw new AppError("Failed to rollback S3 file", 500);
    }
}
