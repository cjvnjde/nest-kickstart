import { Injectable, Logger } from "@nestjs/common";
import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Queue } from "bullmq";
import { InjectQueue } from "@nestjs/bullmq";
import { ConfigService } from "@nestjs/config";

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
    if (isDevelopment) {
      this.logger.log(
        `Email will be sent to ${mailOptions.to} with subject ${mailOptions.subject}. Template: ${mailOptions.template}. Context: ${JSON.stringify(mailOptions.context, null, 2)}`,
      );
    } else {
      await this.emailQueue.add("send-email", mailOptions);
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
