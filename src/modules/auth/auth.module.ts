import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Configuration } from "../../config/configuration";
import { UserEntity } from "../../database/entities";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PasswordResetCodeModule } from "../password-reset-code/password-reset-code.module";
import { EmailModule } from "../email/email.module";
import { EmailConfirmationCodeModule } from "../email-confirmation-code/email-confirmation-code.module";

@Module({
  imports: [
    UserModule,
    EmailModule,
    EmailConfirmationCodeModule,
    PasswordResetCodeModule,
    MikroOrmModule.forFeature({ entities: [UserEntity] }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const environment = configService.get<Configuration["environment"]>("environment");

        return {
          secret: environment.JWT_ACCESS_TOKEN_SECRET,
          signOptions: {
            expiresIn: `${environment.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
