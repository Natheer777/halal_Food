import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";
import { IFileStorageService, UploadFile } from "@application/services/IFileStorageService";

export class S3FileStorageService implements IFileStorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    const region = process.env.AWS_REGION;
    const bucket = process.env.AWS_S3_BUCKET;

    if (!region) {
      throw new Error("AWS_REGION environment variable is not defined.");
    }

    if (!bucket) {
      throw new Error("AWS_S3_BUCKET environment variable is not defined.");
    }

    this.bucketName = bucket;

    this.s3Client = new S3Client({
      region
    });
  }

  async uploadCategoryImage(file: UploadFile): Promise<string> {
    const extension = path.extname(file.originalName) || ".jpg";
    const key = `categories/${randomUUID()}${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimeType
    });

    await this.s3Client.send(command);

    const endpoint =
      process.env.AWS_S3_PUBLIC_ENDPOINT ??
      `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com`;

    return `${endpoint}/${key}`;
  }
}

