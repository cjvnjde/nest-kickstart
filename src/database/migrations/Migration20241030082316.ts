import { Migration } from "@mikro-orm/migrations";

export class Migration20241030082316 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "password_reset_codes"
        add column "expires_at" timestamptz not null;`);

    this.addSql(`alter table "email_confirmation_codes"
        add column "expires_at" timestamptz not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "password_reset_codes" drop column "expires_at";`);

    this.addSql(`alter table "email_confirmation_codes" drop column "expires_at";`);
  }
}
