import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { EmailService } from "./email.service";
import { Injectable } from "@nestjs/common";

@Processor("email")
@Injectable()
export class EmailProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job) {
    await this.emailService.sendEmail(job.data);
  }
}
