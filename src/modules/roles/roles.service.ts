import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../../database/entities";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: EntityRepository<RoleEntity>,
  ) {}

  findByRole(role: string) {
    return this.roleRepository.findOne({ name: role });
  }

  findAllRolesWithPermissions() {
    return this.roleRepository.findAll({ populate: ["permissions"] });
  }
}
