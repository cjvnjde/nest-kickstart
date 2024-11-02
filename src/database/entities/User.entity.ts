import { Collection, Entity, EntityRepositoryType, ManyToMany, OneToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { EmailConfirmationCodeEntity } from "./EmailConfirmationCode.entity";
import { PasswordResetCodeEntity } from "./PasswordResetCode.entity";
import { RoleEntity } from "./Role.entity";
import { SessionEntity } from "./Session.entity";
import { UserEntityRepository } from "../../modules/user/UserEntity.repository";
import { SoftRemovableEntity } from "../../utils/database/SoftRemovableEntity";
import { ExcludeSoftRemovedFilter } from "../../utils/database/ExcludeSoftRemovedFilter";

@ExcludeSoftRemovedFilter()
@Entity({
  tableName: "users",
  repository: () => UserEntityRepository,
})
export class UserEntity extends SoftRemovableEntity {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  uuid: string;

  @Property()
  @Unique()
  email!: string;

  @Property({ nullable: true, name: "email_verified_at" })
  emailVerifiedAt?: Date;

  @Property()
  password: string;

  @Property({ nullable: true })
  name?: string;

  @Property({ defaultRaw: "current_timestamp", name: "created_at" })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date(), defaultRaw: "current_timestamp", name: "updated_at" })
  updatedAt!: Date;

  @ManyToMany({ entity: () => RoleEntity, owner: true, pivotTable: "users_roles", joinColumn: "user_uuid", inverseJoinColumn: "role_uuid" })
  roles = new Collection<RoleEntity>(this);

  @OneToMany({ entity: () => PasswordResetCodeEntity, mappedBy: "user" })
  resetCodes = new Collection<PasswordResetCodeEntity>(this);

  @OneToMany({ entity: () => EmailConfirmationCodeEntity, mappedBy: "user" })
  confirmationCodes = new Collection<EmailConfirmationCodeEntity>(this);

  @OneToMany({ entity: () => SessionEntity, mappedBy: "user" })
  sessions = new Collection<SessionEntity>(this);

  [EntityRepositoryType]?: UserEntityRepository;
}
