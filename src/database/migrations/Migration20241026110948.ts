import { Migration } from "@mikro-orm/migrations";

export class Migration20241026110948 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table "starter" ("uuid" uuid not null, constraint "starter_pkey" primary key ("uuid"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "starter" cascade;`);
  }
}
