import { Collection, Entity, Enum, ManyToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { RoleEntity } from "./Role.entity";
import { PermissionAction } from "../../constants/PermissionAction";

@Entity({
  tableName: "permissions",
})
@Unique({ properties: ["action", "subject"] })
export class PermissionEntity {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  uuid: string;

  @Enum({ items: () => PermissionAction, nativeEnumName: "permission_action" })
  action!: PermissionAction;

  @Property()
  subject: string;

  @ManyToMany({ mappedBy: "permissions", entity: () => RoleEntity })
  roles = new Collection<RoleEntity>(this);
}
