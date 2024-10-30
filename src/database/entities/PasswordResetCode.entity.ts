import { Collection, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { UserEntity } from "./User.entity";

@Entity({
  tableName: "password_reset_codes",
})
export class PasswordResetCodeEntity {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  uuid: string;

  @Property()
  code: string;

  @Property({ defaultRaw: "current_timestamp", name: "created_at" })
  createdAt!: Date;

  @Property({ name: "expires_at" })
  expiresAt: Date;

  @ManyToOne({ entity: () => UserEntity })
  user = new Collection<UserEntity>(this);
}
