import { Migration } from '@mikro-orm/migrations';

export class Migration20241102203755 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create type "permission_action" as enum ('create', 'read', 'update', 'delete', 'manage');`);
    this.addSql(`create table "files" ("uuid" uuid not null default gen_random_uuid(), "original_name" varchar(255) not null, "object_name" varchar(255) not null, "bucket" varchar(255) not null, "mime_type" varchar(255) not null, "size" int not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, constraint "files_pkey" primary key ("uuid"));`);

    this.addSql(`create table "permissions" ("uuid" uuid not null default gen_random_uuid(), "action" "permission_action" not null, "subject" varchar(255) not null, constraint "permissions_pkey" primary key ("uuid"));`);
    this.addSql(`alter table "permissions" add constraint "permissions_action_subject_unique" unique ("action", "subject");`);

    this.addSql(`create table "roles" ("uuid" uuid not null default gen_random_uuid(), "name" varchar(255) not null, constraint "roles_pkey" primary key ("uuid"));`);
    this.addSql(`alter table "roles" add constraint "roles_name_unique" unique ("name");`);

    this.addSql(`create table "roles_permissions" ("role_uuid" uuid not null, "permission_uuid" uuid not null, constraint "roles_permissions_pkey" primary key ("role_uuid", "permission_uuid"));`);

    this.addSql(`create table "users" ("uuid" uuid not null default gen_random_uuid(), "deleted_at" timestamptz null, "email" varchar(255) not null, "email_verified_at" timestamptz null, "password" varchar(255) not null, "name" varchar(255) null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, constraint "users_pkey" primary key ("uuid"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);

    this.addSql(`create table "sessions" ("uuid" uuid not null default gen_random_uuid(), "refresh_token" varchar(255) null, "user_uuid" uuid not null, constraint "sessions_pkey" primary key ("uuid"));`);

    this.addSql(`create table "password_reset_codes" ("uuid" uuid not null default gen_random_uuid(), "code" varchar(255) not null, "created_at" timestamptz not null default current_timestamp, "expires_at" timestamptz not null, "user_uuid" uuid not null, constraint "password_reset_codes_pkey" primary key ("uuid"));`);

    this.addSql(`create table "email_confirmation_codes" ("uuid" uuid not null default gen_random_uuid(), "code" varchar(255) not null, "email" varchar(255) not null, "created_at" timestamptz not null default current_timestamp, "expires_at" timestamptz not null, "user_uuid" uuid not null, constraint "email_confirmation_codes_pkey" primary key ("uuid"));`);

    this.addSql(`create table "users_roles" ("user_uuid" uuid not null, "role_uuid" uuid not null, constraint "users_roles_pkey" primary key ("user_uuid", "role_uuid"));`);

    this.addSql(`alter table "roles_permissions" add constraint "roles_permissions_role_uuid_foreign" foreign key ("role_uuid") references "roles" ("uuid") on update cascade on delete cascade;`);
    this.addSql(`alter table "roles_permissions" add constraint "roles_permissions_permission_uuid_foreign" foreign key ("permission_uuid") references "permissions" ("uuid") on update cascade on delete cascade;`);

    this.addSql(`alter table "sessions" add constraint "sessions_user_uuid_foreign" foreign key ("user_uuid") references "users" ("uuid") on update cascade;`);

    this.addSql(`alter table "password_reset_codes" add constraint "password_reset_codes_user_uuid_foreign" foreign key ("user_uuid") references "users" ("uuid") on update cascade;`);

    this.addSql(`alter table "email_confirmation_codes" add constraint "email_confirmation_codes_user_uuid_foreign" foreign key ("user_uuid") references "users" ("uuid") on update cascade;`);

    this.addSql(`alter table "users_roles" add constraint "users_roles_user_uuid_foreign" foreign key ("user_uuid") references "users" ("uuid") on update cascade on delete cascade;`);
    this.addSql(`alter table "users_roles" add constraint "users_roles_role_uuid_foreign" foreign key ("role_uuid") references "roles" ("uuid") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "roles_permissions" drop constraint "roles_permissions_permission_uuid_foreign";`);

    this.addSql(`alter table "roles_permissions" drop constraint "roles_permissions_role_uuid_foreign";`);

    this.addSql(`alter table "users_roles" drop constraint "users_roles_role_uuid_foreign";`);

    this.addSql(`alter table "sessions" drop constraint "sessions_user_uuid_foreign";`);

    this.addSql(`alter table "password_reset_codes" drop constraint "password_reset_codes_user_uuid_foreign";`);

    this.addSql(`alter table "email_confirmation_codes" drop constraint "email_confirmation_codes_user_uuid_foreign";`);

    this.addSql(`alter table "users_roles" drop constraint "users_roles_user_uuid_foreign";`);

    this.addSql(`drop table if exists "files" cascade;`);

    this.addSql(`drop table if exists "permissions" cascade;`);

    this.addSql(`drop table if exists "roles" cascade;`);

    this.addSql(`drop table if exists "roles_permissions" cascade;`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "sessions" cascade;`);

    this.addSql(`drop table if exists "password_reset_codes" cascade;`);

    this.addSql(`drop table if exists "email_confirmation_codes" cascade;`);

    this.addSql(`drop table if exists "users_roles" cascade;`);

    this.addSql(`drop type "permission_action";`);
  }

}
