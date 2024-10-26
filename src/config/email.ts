import type { MailerOptions } from "@nestjs-modules/mailer";
import type { Configuration } from "./configuration";

const getEmailConfig = (env: Configuration["environment"]) => {
  return {
    transport: {
      host: "mail.adm.tools",
      port: 465,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
      logger: true,
    },
    defaults: {
      from: `"No Reply" <${env.EMAIL_USER}>`,
    },
  } satisfies MailerOptions;
};

export default getEmailConfig;
