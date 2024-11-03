import { Controller, Get, HttpCode, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PermissionAction } from "../../constants/PermissionAction";
import { Can } from "../../decorators/can.decorator";
import { User } from "../../decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { PoliciesGuard } from "../auth/guards/policies.guard";
import { UserDto } from "./dtos/User.dto";
import { UsersService } from "./users.service";
import { PaginatedDto } from "../../utils/dto/PaginatedDto";
import { UserWithRolesDto } from "./dtos/UserWithRolesDto";
import { wrap } from "@mikro-orm/core";

@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get("me")
  @HttpCode(200)
  @ApiOperation({ summary: "Get current user information" })
  @ApiOkResponse({ type: UserDto, description: "Returns the currently authenticated user's details" })
  async me(@User() user: UserDto) {
    const userWithRoles = await this.userService.findWithRolesAndPermissionsByUuid(user.uuid);
    return new UserWithRolesDto(wrap(userWithRoles).toObject());
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: "Get all users with pagination" })
  @ApiOkResponse({ type: PaginatedDto, description: "Returns a paginated list of users" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Number of users to return" })
  @ApiQuery({ name: "offset", required: false, type: Number, description: "Number of users to skip" })
  @Can(PermissionAction.READ, "users")
  async all(@User() user: UserDto, @Query("limit") limit: number, @Query("offset") offset: number) {
    const result = await this.userService.findAll(user, limit, offset);

    return new PaginatedDto(result, UserDto);
  }
}
