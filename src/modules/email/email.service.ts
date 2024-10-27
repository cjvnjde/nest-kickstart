import { Injectable } from "@nestjs/common";
import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Queue } from "bullmq";
import { InjectQueue } from "@nestjs/bullmq";

@Injectable()
export class EmailService {
  constructor(
    private readonly mailer: MailerService,
    @InjectQueue("email") private emailQueue: Queue,
  ) {}

  async sendEmail(mailOptions: Partial<ISendMailOptions>) {
    await this.mailer.sendMail(mailOptions);
  }

  async sendEmailConfirmationCode(code: string, to: string) {
    await this.emailQueue.add("send-email", {
      to,
      subject: "Email confirmation",
      template: "verify-email",
      context: {
        code: code,
      },
    });
  }

  async sendPasswordRestoreCode(code: string, to: string) {
    await this.emailQueue.add("send-email", {
      to,
      subject: "Restore password",
      template: "reset-password",
      context: {
        code: code,
      },
    });
  }
}
