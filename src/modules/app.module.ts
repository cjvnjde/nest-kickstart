import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PingModule } from "./ping/ping.module";
import configuration, { type Configuration } from "../config/configuration";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import databaseConfig from "../config/database";
import { AcceptLanguageResolver, HeaderResolver, I18nModule, I18nService, QueryResolver } from "nestjs-i18n";
import { join } from "node:path";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: configuration,
      isGlobal: true,
      cache: true,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow<Configuration["fallbackLanguage"]>("fallbackLanguage"),
        loaderOptions: {
          path: join(__dirname, "../resources/i18n/"),
          watch: true,
        },
      }),
      resolvers: [{ use: QueryResolver, options: ["lang"] }, AcceptLanguageResolver, new HeaderResolver(["x-lang"])],
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      inject: [I18nService, ConfigService],
      useFactory: (i18n: I18nService, configService: ConfigService) => ({
        ...configService.getOrThrow<Configuration["email"]>("email"),
        template: {
          dir: join(__dirname, "../resources/templates/"),
          adapter: new HandlebarsAdapter({ t: i18n.hbsHelper }),
        },
      }),
    }),
    MikroOrmModule.forRoot(databaseConfig),
    PingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
