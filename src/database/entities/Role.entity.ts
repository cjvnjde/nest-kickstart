import { Collection, Entity, ManyToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { PermissionEntity } from "./Permission.entity";
import { UserEntity } from "./User.entity";

@Entity({
  tableName: "roles",
})
export class RoleEntity {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  uuid: string;

  @Property()
  @Unique()
  name: string;

  @ManyToMany({ entity: () => PermissionEntity, owner: true, pivotTable: "roles_permissions", joinColumn: "role_uuid", inverseJoinColumn: "permission_uuid" })
  permissions = new Collection<PermissionEntity>(this);

  @ManyToMany({ mappedBy: "roles", entity: () => UserEntity })
  users = new Collection<UserEntity>(this);
}
