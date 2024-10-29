import { Migration } from "@mikro-orm/migrations";

export class Migration20241029082726 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create type "permission_action" as enum ('create', 'read', 'update', 'delete', 'manage');`);
    this.addSql(`alter table "permissions" alter column "action" type "permission_action" using ("action"::"permission_action");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "permissions" alter column "action" type varchar(255) using ("action"::varchar(255));`);

    this.addSql(`drop type "permission_action";`);
  }
}
