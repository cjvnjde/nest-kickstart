import { defineAbility, PureAbility } from "@casl/ability";
import { wrap } from "@mikro-orm/core";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CHECK_POLICIES_KEY } from "../../../decorators/can.decorator";
import { UserWithRolesDto } from "../../users/dtos/UserWithRolesDto";
import { UsersService } from "../../users/users.service";

export type PolicyHandler = (ability: PureAbility) => boolean;

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const handlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

    const request = context.switchToHttp().getRequest();
    const user = await this.userService.findWithRolesAndPermissionsByUuid(request.user.uuid);

    const userDto = new UserWithRolesDto(wrap(user).toObject());

    const ability = defineAbility((can) => {
      userDto.roles.forEach((role) => {
        role.permissions.forEach((permission) => {
          can(permission.action, permission.subject);
        });
      });
    });

    return handlers.every((handler) => handler(ability));
  }
}
