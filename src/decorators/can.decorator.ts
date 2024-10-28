import { PureAbility } from "@casl/ability";
import { SetMetadata } from "@nestjs/common";
import { CHECK_POLICIES_KEY } from "../modules/auth/guards/policies.guard";

export const Can = (action: string, subject: string) => SetMetadata(CHECK_POLICIES_KEY, [(ability: PureAbility) => ability.can(action, subject)]);
