import { Test, TestingModule } from "@nestjs/testing";
import { EmailConfirmationCodeService } from "./email-confirmation-code.service";

describe("EmailConfirmationCodeService", () => {
  let service: EmailConfirmationCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailConfirmationCodeService],
    }).compile();

    service = module.get<EmailConfirmationCodeService>(EmailConfirmationCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
