import type { MailerOptions } from "@nestjs-modules/mailer";
import type { Configuration } from "./configuration";
import { join } from "node:path";
import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";

const getEmailConfig = (env: Configuration["environment"]) => {
  return {
    transport: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      logger: true,
    },
    defaults: {
      from: `"No Reply" <${env.SMTP_USER}>`,
    },
    template: {
      dir: join(__dirname, "../resources/templates"),
      adapter: new PugAdapter(),
      options: {
        strict: true,
      },
    },
  } satisfies MailerOptions;
};

export default getEmailConfig;
