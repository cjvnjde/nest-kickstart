import { PureAbility } from "@casl/ability";
import { SetMetadata } from "@nestjs/common";
import { PermissionAction } from "../constants/PermissionAction";

export const CHECK_POLICIES_KEY = "check_policy";

export const Can = (action: PermissionAction, subject: string) => SetMetadata(CHECK_POLICIES_KEY, [(ability: PureAbility) => ability.can(action, subject)]);
