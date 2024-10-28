import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { UserEntity } from "./User.entity";

@Entity({
  tableName: "sessions",
})
export class SessionEntity {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  uuid: string;

  @Property({ nullable: true })
  refreshToken?: string;

  @ManyToOne({ entity: () => UserEntity })
  user: UserEntity;
}
