import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createAccessTokenInterceptor, createUserClient, UserServiceClient } from "@zitadel/node/api";
import type { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class UserService {
  private userClient: UserServiceClient;

  constructor(configService: ConfigService) {
    const apiEndpoint = configService.get<string>("environment.IDP_AUTHORITY");
    const personalAccessToken = configService.get<string>("environment.ACCESS_TOKEN");

    const accessTokenInterceptor = createAccessTokenInterceptor(personalAccessToken);
    this.userClient = createUserClient(apiEndpoint, accessTokenInterceptor);
  }

  async createUser(createUserDta: CreateUserDto) {
    const { email, password } = createUserDta;

    const user = await this.userClient.addHumanUser({
      email: {
        email,
      },
      profile: {
        givenName: email.split("@")[0],
        familyName: email.split("@")[0],
      },
      password: {
        password,
      },
    });
    return user;
  }
}
