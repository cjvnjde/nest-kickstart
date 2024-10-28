import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Configuration } from "../../../config/configuration";
import { UserEntity } from "../../../database/entities";
import { UserService } from "../../user/user.service";
import { AuthService } from "../auth.service";
import { JwtCookieStrategy } from "../../../utils/JwtCookieStrategy";
import { UserDto } from "../../user/dtos/User.dto";
import { Request, Response } from "express";
import { compareHash } from "../../../utils/compareHash";

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtCookieStrategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
    const environment = configService.get<Configuration["environment"]>("environment");

    super({
      secretOrKey: environment.JWT_ACCESS_TOKEN_SECRET,
      accessCookieName: environment.ACCESS_TOKEN_COOKIE,
      refreshCookieName: environment.REFRESH_TOKEN_COOKIE,
    });
  }

  async validate(request: Request, payload: { userId: string }) {
    let user = await this.userService.findByUuid(payload?.userId);

    if (!user || !payload) {
      user = await this.getUserWithTokens(request);
    }

    return new UserDto(user);
  }

  async getUserWithTokens(request: Request): Promise<UserEntity> {
    const environment = this.configService.get<Configuration["environment"]>("environment");

    const refreshToken = request.cookies?.[environment.REFRESH_TOKEN_COOKIE];

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const payload = this.jwtService.decode<{ userId?: string }>(refreshToken);
    const user = await this.userService.findByUuid(payload?.userId);

    let isValidRefreshToken = false;

    try {
      isValidRefreshToken = Boolean(user) && compareHash(refreshToken, user.refreshToken);
    } catch (error) {
      throw new UnauthorizedException();
    }

    if (!isValidRefreshToken) {
      throw new UnauthorizedException();
    }

    const response: Response = request.res;

    await this.authService.setResponseCookies(response, user);

    return user;
  }
}
