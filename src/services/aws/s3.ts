import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const accessKeyId = process.env.AWS_ACCESSKEYID as string;
const secretAccessKey = process.env.AWS_SECRETACCESSKEY as string;

class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucketName = process.env.AWS_BUCKET_NAME!;
  }

  async uploadFile(fileBuffer: Buffer, key: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: "image/jpeg",
    });

    await this.s3Client.send(command);

    const fileUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return fileUrl;
  }

  async getFile(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const response = await this.s3Client.send(command);
    const stream = response.Body as NodeJS.ReadableStream;

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }
}
export default new S3Service();
