import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { isPast } from "date-fns";
import { Response } from "express";
import { Configuration } from "../../config/configuration";
import { SessionEntity } from "../../database/entities";
import { createHash } from "../../utils/createHash";
import { EmailConfirmationCodesService } from "../email-confirmation-codes/email-confirmation-codes.service";
import { PasswordResetCodesService } from "../password-reset-codes/password-reset-codes.service";
import { UserDto } from "../users/dtos/User.dto";
import { UsersService } from "../users/users.service";
import { UserRegistrationDto } from "./dtos/UserRegistration.dto";
import { JWTPayload } from "./types/JWTPayload";

type Token = {
  expirationTime: number;
  token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly emailConfirmationCodeService: EmailConfirmationCodesService,
    private readonly passwordResetCodeService: PasswordResetCodesService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: EntityRepository<SessionEntity>,
    private readonly em: EntityManager,
  ) {}

  async register(data: UserRegistrationDto): Promise<void> {
    const user = await this.userService.findByEmail(data.email);

    if (user) {
      throw new ForbiddenException("Email already in use");
    }

    await this.userService.create(data);
  }

  async createSession(user: UserDto) {
    const newSession = this.sessionRepository.create({
      user: user.uuid,
    });
    await this.em.persistAndFlush(newSession);
    return newSession.uuid;
  }

  async setSessionToken(sessionUuid: string, token: string) {
    await this.sessionRepository.nativeUpdate({ uuid: sessionUuid }, { refreshToken: createHash(token) });
  }

  getAccessToken(userUuid: string, sessionUuid: string): Token {
    const environment = this.configService.get<Configuration["environment"]>("environment");

    const token = this.jwtService.sign({ userUuid, sessionUuid } satisfies JWTPayload, {
      secret: environment.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: environment.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
    });

    return {
      expirationTime: environment.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
      token,
    };
  }

  findSessionWithUserByUuid(sessionUuid: string) {
    return this.sessionRepository.findOne({ uuid: sessionUuid }, { populate: ["user"] });
  }

  getRefreshToken(userUuid: string, sessionUuid: string): Token {
    const environment = this.configService.get<Configuration["environment"]>("environment");

    const token = this.jwtService.sign({ userUuid, sessionUuid } satisfies JWTPayload, {
      secret: environment.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: environment.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
    });

    return {
      expirationTime: environment.JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS,
      token,
    };
  }

  public async setAuthCookies(
    response: Response,
    sessionUuid: string,
    {
      accessToken,
      refreshToken,
    }: {
      accessToken: Token;
      refreshToken: Token;
    },
  ) {
    const environment = this.configService.get<Configuration["environment"]>("environment");

    await this.setSessionToken(sessionUuid, refreshToken.token);

    response.cookie(environment.REFRESH_TOKEN_COOKIE, refreshToken.token, {
      httpOnly: true,
      maxAge: refreshToken.expirationTime / 1000,
    });

    response.cookie(environment.ACCESS_TOKEN_COOKIE, accessToken.token, {
      httpOnly: true,
      maxAge: accessToken.expirationTime / 1000,
    });
  }

  async createPasswordResetCode(email: string) {
    return this.passwordResetCodeService.create(email);
  }

  async deleteSessions(userUuid: string) {
    await this.sessionRepository.nativeDelete({ user: userUuid });
  }

  public clearCookies(response: Response) {
    const environment = this.configService.get<Configuration["environment"]>("environment");

    response.cookie(environment.REFRESH_TOKEN_COOKIE, "", {
      httpOnly: true,
    });

    response.cookie(environment.ACCESS_TOKEN_COOKIE, "", {
      httpOnly: true,
    });
  }

  async resetPassword(password: string, code: string) {
    const lastCode = await this.passwordResetCodeService.findOne(code);

    if (!lastCode || lastCode.code !== code) {
      throw new ForbiddenException("Invalid code");
    }

    if (isPast(lastCode.expiresAt)) {
      throw new ForbiddenException("Code has expired");
    }

    return this.userService.updatePassword(new UserDto(lastCode.user as any), password);
  }

  async createEmailConfirmationCode(user: UserDto) {
    return this.emailConfirmationCodeService.create(user);
  }

  async confirmEmail(user: UserDto, code: string) {
    const lastCode = await this.emailConfirmationCodeService.findOneWithUser(code);

    if (!lastCode || lastCode.code !== code || lastCode.email !== user.email) {
      throw new ForbiddenException("Invalid code");
    }

    if (isPast(lastCode.expiresAt)) {
      throw new ForbiddenException("Code has expired");
    }

    return this.userService.confirmEmail(user);
  }
}
