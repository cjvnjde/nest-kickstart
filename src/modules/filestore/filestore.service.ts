import { EntityManager } from "@mikro-orm/postgresql";
import { Inject, Injectable } from "@nestjs/common";
import { Client } from "minio";
import { MINIO_CONNECTION } from "nestjs-minio";
import { FileEntity } from "src/database/entities";

@Injectable()
export class FilestoreService {
  private urlExpiryS = 60 * 5; // 5 mins
  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: Client,
    private readonly em: EntityManager,
  ) {}

  async uploadFile(file: Express.Multer.File, bucketName = "storage") {
    const objectName = `${Date.now()}-${file.originalname}`;

    await this.minioClient.putObject(bucketName, objectName, file.buffer);

    const fileEntity = new FileEntity(file.originalname, objectName, file.mimetype, file.size, bucketName);

    await this.em.persistAndFlush(fileEntity);

    return {
      bucketName,
      objectName,
    };
  }

  getFileUrl(objectName: string, bucketName = "storage") {
    return this.minioClient.presignedUrl("GET", bucketName, objectName, this.urlExpiryS);
  }
}
