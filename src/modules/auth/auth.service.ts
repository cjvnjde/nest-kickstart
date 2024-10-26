import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import type { RegisterUserDto } from "./dto/register-user.dto";
import { ConfigService } from "@nestjs/config";
import { createAccessTokenInterceptor, createSessionClient, SessionServiceClient } from "@zitadel/node/api";
import type { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  private sessionClient: SessionServiceClient;
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    configService: ConfigService,
  ) {
    const apiEndpoint = configService.get<string>("environment.IDP_AUTHORITY");
    const personalAccessToken = configService.get<string>("environment.ACCESS_TOKEN");

    const accessTokenInterceptor = createAccessTokenInterceptor(personalAccessToken);
    this.sessionClient = createSessionClient(apiEndpoint, accessTokenInterceptor);
  }

  register(registerUserDto: RegisterUserDto) {
    return this.userService.createUser(registerUserDto);
  }

  async login(loginDto: LoginDto) {
    const data = await this.sessionClient.createSession({
      checks: {
        user: {
          loginName: loginDto.email,
        },
        password: {
          password: loginDto.password,
        },
      },
    });
    console.log(data);
    return data;
  }
}
