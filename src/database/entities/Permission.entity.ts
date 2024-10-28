import { Collection, Entity, ManyToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { RoleEntity } from "./Role.entity";

@Entity({
  tableName: "permissions",
})
@Unique({ properties: ["action", "subject"] })
export class PermissionEntity {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  uuid: string;

  @Property()
  action: string;

  @Property()
  subject: string;

  @ManyToMany({ mappedBy: "permissions", entity: () => RoleEntity })
  roles = new Collection<RoleEntity>(this);
}
