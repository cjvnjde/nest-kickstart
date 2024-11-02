import { Migration } from '@mikro-orm/migrations';

export class Migration20241102132801 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "files" ("uuid" uuid not null default gen_random_uuid(), "original_name" varchar(255) not null, "object_name" varchar(255) not null, "bucket" varchar(255) not null, "mime_type" varchar(255) not null, "size" int not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, constraint "files_pkey" primary key ("uuid"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "files" cascade;`);
  }

}
