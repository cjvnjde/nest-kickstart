import { Collection, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { UserEntity } from "./User.entity";

@Entity({
  tableName: "email_confirmation_codes",
})
export class EmailConfirmationCodeEntity {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  uuid: string;

  @Property()
  code: string;

  @Property()
  email: string;

  @Property({ defaultRaw: "current_timestamp", name: "created_at" })
  createdAt!: Date;

  @ManyToOne({ entity: () => UserEntity })
  user = new Collection<UserEntity>(this);
}
