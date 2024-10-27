import { Collection, Entity, ManyToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { RoleEntity } from "./Role.entity";

@Entity({
  tableName: "permissions",
})
export class PermissionEntity {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  uuid: string;

  @Property()
  @Unique()
  name!: string;

  @ManyToMany({ mappedBy: "permissions", entity: () => RoleEntity })
  roles = new Collection<RoleEntity>(this);
}
