import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Configuration } from "../../config/configuration";
import { SessionEntity } from "../../database/entities";
import { EmailConfirmationCodeModule } from "../email-confirmation-code/email-confirmation-code.module";
import { EmailModule } from "../email/email.module";
import { PasswordResetCodeModule } from "../password-reset-code/password-reset-code.module";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    UserModule,
    EmailModule,
    EmailConfirmationCodeModule,
    PasswordResetCodeModule,
    MikroOrmModule.forFeature({ entities: [SessionEntity] }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const environment = configService.get<Configuration["environment"]>("environment");

        return {
          secret: environment.JWT_ACCESS_TOKEN_SECRET,
          signOptions: {
            expiresIn: environment.JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
