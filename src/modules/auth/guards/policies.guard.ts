import { defineAbility, PureAbility } from "@casl/ability";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserWithRolesDto } from "../../user/dtos/UserWithRolesDto";
import { UserService } from "../../user/user.service";

export const CHECK_POLICIES_KEY = "check_policy";
export type PolicyHandler = (ability: PureAbility) => boolean;

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const handlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

    const request = context.switchToHttp().getRequest();
    const user = await this.userService.findWithRolesAndPermissionsByUuid(request.user.uuid);

    const userDto = new UserWithRolesDto(user as any);

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
