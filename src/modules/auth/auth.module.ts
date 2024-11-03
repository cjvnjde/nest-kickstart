import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Configuration } from "../../config/configuration";
import { SessionEntity } from "../../database/entities";
import { EmailConfirmationCodesModule } from "../email-confirmation-codes/email-confirmation-codes.module";
import { EmailModule } from "../email/email.module";
import { PasswordResetCodesModule } from "../password-reset-codes/password-reset-codes.module";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    UsersModule,
    EmailModule,
    EmailConfirmationCodesModule,
    PasswordResetCodesModule,
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
