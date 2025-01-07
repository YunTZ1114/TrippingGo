import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY } from 'src/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const folder = 'tripping_go';
    const fileName = `${folder}/${uuid()}-${file.originalname}`;

    const params = {
      Bucket: 'bumiverse',
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const upload = await this.s3.upload(params).promise();
      return upload.Location;
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }
}
