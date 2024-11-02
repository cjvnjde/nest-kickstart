import { Inject, Injectable } from "@nestjs/common";
import { Client } from "minio";
import { MINIO_CONNECTION } from "nestjs-minio";

@Injectable()
export class FilestoreService {
  private urlExpiryS = 60 * 5; // 5 mins
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) {}

  async uploadFile(file: Express.Multer.File, bucketName = "storage") {
    const objectName = `${Date.now()}-${file.originalname}`;

    await this.minioClient.putObject(bucketName, objectName, file.buffer);

    return {
      bucketName,
      objectName,
    };
  }

  getFileUrl(objectName: string, bucketName = "storage") {
    return this.minioClient.presignedUrl("GET", bucketName, objectName, this.urlExpiryS);
  }
}
