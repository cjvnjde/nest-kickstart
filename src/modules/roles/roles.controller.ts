import { Controller, Get, UseGuards } from "@nestjs/common";
import { wrap } from "@mikro-orm/core";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { Can } from "src/decorators/can.decorator";
import { PermissionAction } from "src/constants/PermissionAction";
import { RolesService } from "./roles.service";
import { RoleDto } from "./dto/Role.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PoliciesGuard } from "../auth/guards/policies.guard";

@ApiTags("roles")
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Can(PermissionAction.READ, "roles")
  @ApiOperation({ summary: "Get all roles with permissions" })
  @ApiResponse({ status: 200, description: "Successful retrieval of roles", type: [RoleDto] })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async getRoles() {
    const policies = await this.rolesService.findAllRolesWithPermissions();

    return policies.map((role) => new RoleDto(wrap(role).toObject()));
  }
}
