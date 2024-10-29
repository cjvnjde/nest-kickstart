import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Queue } from "bullmq";
import { I18nContext } from "nestjs-i18n";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailer: MailerService,
    @InjectQueue("email") private emailQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(mailOptions: Partial<ISendMailOptions>) {
    await this.mailer.sendMail(mailOptions);
  }

  async addEmailToQueue(mailOptions: Partial<ISendMailOptions>) {
    const isDevelopment = this.configService.get<boolean>("isDevelopment");
    const i18n = I18nContext.current();

    const mailOptionsWithLang = {
      ...mailOptions,
      template: `${i18n.lang}/${mailOptions.template}`,
    };

    if (isDevelopment) {
      this.logger.log(
        `Email will be sent to ${mailOptionsWithLang.to} with subject ${mailOptionsWithLang.subject}. Template: ${mailOptionsWithLang.template}. Context: ${JSON.stringify(mailOptionsWithLang.context, null, 2)}`,
      );
    } else {
      await this.emailQueue.add("send-email", mailOptionsWithLang);
    }
  }

  async sendEmailConfirmationCode(code: string, to: string) {
    await this.addEmailToQueue({
      to,
      subject: "Email confirmation",
      template: "verify-email",
      context: {
        code: code,
      },
    });
  }

  async sendPasswordRestoreCode(code: string, to: string) {
    await this.addEmailToQueue({
      to,
      subject: "Restore password",
      template: "reset-password",
      context: {
        code: code,
      },
    });
  }
}
