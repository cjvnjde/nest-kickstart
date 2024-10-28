import { Migration } from "@mikro-orm/migrations";

export class Migration20241028160710 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "sessions" ("uuid" uuid not null default gen_random_uuid(), "refresh_token" varchar(255) null, "user_uuid" uuid not null, constraint "sessions_pkey" primary key ("uuid"));`,
    );

    this.addSql(`alter table "sessions" add constraint "sessions_user_uuid_foreign" foreign key ("user_uuid") references "users" ("uuid") on update cascade;`);

    this.addSql(`alter table "users" drop column "refresh_token";`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "sessions" cascade;`);

    this.addSql(`alter table "users" add column "refresh_token" varchar(255) null;`);
  }
}
