import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Request, Response } from "express";
import { Configuration } from "../../../config/configuration";
import { UserEntity } from "../../../database/entities";
import { compareHash } from "../../../utils/compareHash";
import { JwtCookieStrategy } from "../../../utils/auth/JwtCookieStrategy";
import { UserDto } from "../../users/dtos/User.dto";
import { AuthService } from "../auth.service";
import { JWTPayload } from "../types/JWTPayload";

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtCookieStrategy) {
  constructor(
    private readonly configService: ConfigService,
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

  async validate(request: Request, payload: JWTPayload) {
    const session = await this.authService.findSessionWithUserByUuid(payload?.sessionUuid);
    let user = session?.user;

    if (!user || !payload) {
      user = await this.getUserWithTokens(request);
    }

    return new UserDto(user);
  }

  async getUserWithTokens(request: Request): Promise<UserEntity> {
    const environment = this.configService.get<Configuration["environment"]>("environment");

    const currentRefreshToken = request.cookies?.[environment.REFRESH_TOKEN_COOKIE];

    if (!currentRefreshToken) {
      throw new UnauthorizedException();
    }

    const payload = this.jwtService.decode<JWTPayload>(currentRefreshToken);
    const session = await this.authService.findSessionWithUserByUuid(payload?.sessionUuid);
    const user = session?.user;

    let isValidRefreshToken = false;

    try {
      isValidRefreshToken = Boolean(user) && payload.userUuid === user.uuid && compareHash(currentRefreshToken, session.refreshToken);
    } catch (error) {
      throw new UnauthorizedException();
    }

    if (!isValidRefreshToken) {
      throw new UnauthorizedException();
    }

    const response: Response = request.res;

    const accessToken = this.authService.getAccessToken(user.uuid, session.uuid);
    const refreshToken = this.authService.getRefreshToken(user.uuid, session.uuid);
    await this.authService.setAuthCookies(response, session.uuid, {
      accessToken,
      refreshToken,
    });

    return user;
  }
}
