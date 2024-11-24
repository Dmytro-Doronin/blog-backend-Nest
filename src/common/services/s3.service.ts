import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
    private s3: AWS.S3;

    constructor() {
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }

    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        const uploadResult = await this.s3
            .upload({
                Bucket: process.env.AWS_BUCKET_NAME as string,
                Key: `${folder}/${Date.now()}_${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            })
            .promise()

        return uploadResult.Location
    }

    async deleteFile(key: string): Promise<void> {
        try {
            await this.s3
                .deleteObject({
                    Bucket: process.env.AWS_BUCKET_NAME as string,
                    Key: key,
                })
                .promise();
            console.log(`File ${key} deleted successfully.`);
        } catch (error) {
            console.error(`Failed to delete file ${key}: ${error.message}`);
            throw new Error(`Unable to delete file: ${key}`);
        }
    }
}