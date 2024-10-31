import { Controller, Get, HttpCode, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { PermissionAction } from "../../constants/PermissionAction";
import { Can } from "../../decorators/can.decorator";
import { User } from "../../decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { PoliciesGuard } from "../auth/guards/policies.guard";
import { UserDto } from "./dtos/User.dto";
import { UserService } from "./user.service";
import { PaginatedDto } from "../../utils/PaginatedDto";

@ApiTags("user")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  @HttpCode(200)
  @ApiOkResponse({ type: UserDto })
  async me(@User() user: UserDto) {
    return user;
  }

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: PaginatedDto })
  @Can(PermissionAction.READ, "user-list")
  async all(@User() user: UserDto, @Query("limit") limit: number, @Query("offset") offset: number) {
    const result = await this.userService.findAll(user, limit, offset);

    return new PaginatedDto(result, UserDto);
  }
}
