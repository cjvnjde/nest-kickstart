import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { Configuration } from "../../config/configuration";
import { MailerModule } from "@nestjs-modules/mailer";
import { BullModule } from "@nestjs/bullmq";
import { EmailProcessor } from "./email.processor";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get<Configuration["email"]>("email"),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: "email" }),
  ],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
