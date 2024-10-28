import { MikroOrmModule } from "@mikro-orm/nestjs";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration, { type Configuration } from "../config/configuration";
import databaseConfig from "../config/database";
import { AuthModule } from "./auth/auth.module";
import { EmailConfirmationCodeModule } from "./email-confirmation-code/email-confirmation-code.module";
import { EmailModule } from "./email/email.module";
import { PasswordResetCodeModule } from "./password-reset-code/password-reset-code.module";
import { PoliciesModule } from "./policies/policies.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: configuration,
      isGlobal: true,
      cache: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get<Configuration["bull"]>("bull"),
      inject: [ConfigService],
    }),
    MikroOrmModule.forRoot(databaseConfig),
    AuthModule,
    EmailModule,
    UserModule,
    PasswordResetCodeModule,
    EmailConfirmationCodeModule,
    PoliciesModule,
  ],
})
export class RootModule {}
