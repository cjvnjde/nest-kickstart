import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { PermissionEntity, RoleEntity } from "../entities";

export class PermissionsRolesSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const permissionsData = [{ action: "manage", subject: "all" }];

    const permissions = permissionsData.map((permData) => em.create(PermissionEntity, permData));

    await em.persistAndFlush(permissions);

    const rolesData = [
      { name: "admin", permissions: permissions },
      { name: "user", permissions: [] },
    ];

    const roles = rolesData.map((roleData) => {
      const role = em.create(RoleEntity, { name: roleData.name });
      role.permissions.set(roleData.permissions);
      return role;
    });

    await em.persistAndFlush(roles);
  }
}
