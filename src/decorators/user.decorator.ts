import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { UserDto } from "../modules/user/dtos/User.dto";

export const User = createParamDecorator(<K extends keyof UserDto | undefined>(data: K, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  if ("email" in user && "uuid" in user) {
    const userDto = new UserDto(user);
    return data ? userDto[data] : userDto;
  }

  throw new UnauthorizedException("User not found");
});
