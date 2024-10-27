import { ForbiddenException, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { UserRegistrationDto } from "./dtos/UserRegistration.dto";
import { ConfigService } from "@nestjs/config";
import { Configuration } from "../../config/configuration";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { UserDto } from "../user/dtos/User.dto";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, wrap } from "@mikro-orm/core";
import { UserEntity } from "../../database/entities";
import { PasswordResetCodeService } from "../password-reset-code/password-reset-code.service";
import { addMilliseconds, isPast } from "date-fns";
import { EmailConfirmationCodeService } from "../email-confirmation-code/email-confirmation-code.service";

type Token = {
  expirationTime: number;
  token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailConfirmationCodeService: EmailConfirmationCodeService,
    private readonly passwordResetCodeService: PasswordResetCodeService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
    private readonly em: EntityManager,
  ) {}

  async register(data: UserRegistrationDto): Promise<void> {
    const user = await this.userService.findByEmail(data.email);

    if (user) {
      throw new ForbiddenException("Email already in use");
    }

    await this.userService.create(data);
  }

  getAccessToken(userId: string): Token {
    const environment = this.configService.get<Configuration["environment"]>("environment");

    const token = this.jwtService.sign(
      { userId },
      {
        secret: environment.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: `${environment.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
      },
    );

    return {
      expirationTime: environment.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      token,
    };
  }

  getRefreshToken(userId: string): Token {
    const environment = this.configService.get<Configuration["environment"]>("environment");

    const token = this.jwtService.sign(
      { userId },
      {
        secret: environment.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: `${environment.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s`,
      },
    );

    return {
      expirationTime: environment.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      token,
    };
  }

  async saveRefreshToken(refreshToken: string, user: UserDto): Promise<void> {
    const userItem = await this.userRepository.findOneOrFail(user.uuid);
    wrap(userItem).assign({
      refreshToken,
    });
    await this.em.flush();
  }

  public async setResponseCookies(response: Response, user: UserDto) {
    const environment = this.configService.get<Configuration["environment"]>("environment");

    const accessToken = this.getAccessToken(user.uuid);
    const refreshToken = this.getRefreshToken(user.uuid);
    await this.saveRefreshToken(refreshToken.token, user);

    response.cookie(environment.REFRESH_TOKEN_COOKIE, refreshToken.token, {
      httpOnly: true,
      maxAge: refreshToken.expirationTime,
    });

    response.cookie(environment.ACCESS_TOKEN_COOKIE, accessToken.token, {
      httpOnly: true,
      maxAge: accessToken.expirationTime,
    });
  }

  async createPasswordResetCode(email: string) {
    return this.passwordResetCodeService.create(email);
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
    const environment = this.configService.get<Configuration["environment"]>("environment");

    const lastCode = await this.passwordResetCodeService.findOne(code);

    const isCodeValid = lastCode.code === code;
    const isCodeExtant = isPast(addMilliseconds(lastCode.createdAt, environment.EMAIL_CODE_EXPIRE_TIME));

    if (isCodeValid && isCodeExtant) {
      return this.userService.updatePassword(new UserDto(lastCode.user as any), password);
    }

    throw new ForbiddenException("Invalid code");
  }

  async createEmailConfirmationCode(user: UserDto) {
    return this.emailConfirmationCodeService.create(user);
  }

  async confirmEmail(user: UserDto, code: string) {
    const environment = this.configService.get<Configuration["environment"]>("environment");

    const lastCode = await this.emailConfirmationCodeService.findOne(code);

    const isCodeValid = lastCode.code === code && lastCode.email === user.email;
    const isCodeExtant = isPast(addMilliseconds(lastCode.createdAt, environment.EMAIL_CODE_EXPIRE_TIME));

    if (isCodeValid && isCodeExtant) {
      await this.userService.confirmEmail(user);
    }
  }
}
