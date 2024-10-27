import { Controller, Get, HttpCode, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { User } from "../../decorators/user.decorator";
import { UserDto } from "./dtos/User.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

@ApiTags("user")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  @Get("me")
  @HttpCode(200)
  @ApiOkResponse({ type: UserDto })
  me(@User() user: UserDto) {
    return user;
  }
}
