import { MikroOrmModule } from "@mikro-orm/nestjs";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { join } from "node:path";
import configuration, { type Configuration } from "../config/configuration";
import databaseConfig from "../config/database";
import { AuthModule } from "./auth/auth.module";
import { EmailConfirmationCodesModule } from "./email-confirmation-codes/email-confirmation-codes.module";
import { EmailModule } from "./email/email.module";
import { PasswordResetCodesModule } from "./password-reset-codes/password-reset-codes.module";
import { PingModule } from "./ping/ping.module";
import { RolesModule } from "./roles/roles.module";
import { UsersModule } from "./users/users.module";

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
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: join(__dirname, "../resources/i18n/"),
        watch: true,
      },
      typesOutputPath: join(__dirname, "../../src/generated/i18n.generated.ts"),
      resolvers: [{ use: QueryResolver, options: ["lang"] }, AcceptLanguageResolver, new HeaderResolver(["x-lang"])],
    }),
    MikroOrmModule.forRoot(databaseConfig),
    AuthModule,
    EmailModule,
    UsersModule,
    PasswordResetCodesModule,
    EmailConfirmationCodesModule,
    RolesModule,
    PingModule,
  ],
})
export class RootModule {}
