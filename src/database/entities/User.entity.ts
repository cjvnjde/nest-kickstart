import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { RoleEntity } from "./Role.entity";
import { PasswordResetCodeEntity } from "./PasswordResetCode.entity";
import { EmailConfirmationCodeEntity } from "./EmailConfirmationCode.entity";

@Entity({
  tableName: "users",
})
export class UserEntity {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  uuid: string;

  @Property()
  @Unique()
  email!: string;

  @Property({ nullable: true, name: "email_verified_at" })
  emailVerifiedAt?: Date;

  @Property()
  password: string;

  @Property({ nullable: true, name: "refresh_token" })
  refreshToken: string;

  @Property({ nullable: true })
  name?: string;

  @Property({ defaultRaw: "current_timestamp", name: "created_at" })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date(), defaultRaw: "current_timestamp", name: "updated_at" })
  updatedAt!: Date;

  @ManyToMany({ entity: () => RoleEntity })
  roles = new Collection<RoleEntity>(this);

  @OneToMany({ entity: () => PasswordResetCodeEntity, mappedBy: "user" }) // referenced entity type can be sniffer too
  resetCodes = new Collection<PasswordResetCodeEntity>(this);

  @OneToMany({ entity: () => EmailConfirmationCodeEntity, mappedBy: "user" }) // referenced entity type can be sniffer too
  confirmationCodes = new Collection<EmailConfirmationCodeEntity>(this);
}
