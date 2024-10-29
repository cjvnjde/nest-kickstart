import { Controller, Get, HttpCode, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { PermissionAction } from "../../constants/PermissionAction";
import { Can } from "../../decorators/can.decorator";
import { User } from "../../decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { PoliciesGuard } from "../auth/guards/policies.guard";
import { UserDto } from "./dtos/User.dto";

@ApiTags("user")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller("user")
export class UserController {
  @Get("me")
  @HttpCode(200)
  @ApiOkResponse({ type: UserDto })
  async me(@User() user: UserDto) {
    return user;
  }

  @Get("admin")
  @HttpCode(200)
  @ApiOkResponse({ type: UserDto })
  @Can(PermissionAction.READ, "user")
  async admin(@User() user: UserDto) {
    return user;
  }
}
