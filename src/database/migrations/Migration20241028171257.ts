import { Migration } from "@mikro-orm/migrations";

export class Migration20241028171257 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "permissions" drop constraint "permissions_name_unique";`);

    this.addSql(`alter table "permissions" add column "subject" varchar(255) not null;`);
    this.addSql(`alter table "permissions" rename column "name" to "action";`);
    this.addSql(`alter table "permissions" add constraint "permissions_action_subject_unique" unique ("action", "subject");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "permissions" drop constraint "permissions_action_subject_unique";`);
    this.addSql(`alter table "permissions" drop column "subject";`);

    this.addSql(`alter table "permissions" rename column "action" to "name";`);
    this.addSql(`alter table "permissions" add constraint "permissions_name_unique" unique ("name");`);
  }
}
