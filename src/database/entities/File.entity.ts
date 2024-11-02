import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "files" })
export class FileEntity {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  uuid: string;

  @Property()
  originalName: string;

  @Property()
  objectName: string;

  @Property()
  bucket: string;

  @Property()
  mimeType: string;

  @Property()
  size: number;

  @Property({ defaultRaw: "current_timestamp", name: "created_at" })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date(), defaultRaw: "current_timestamp", name: "updated_at" })
  updatedAt!: Date;

  constructor(originalName: string, objectName: string, mimeType: string, size: number, bucket: string) {
    this.originalName = originalName;
    this.objectName = objectName;
    this.mimeType = mimeType;
    this.size = size;
    this.bucket = bucket;
  }
}
