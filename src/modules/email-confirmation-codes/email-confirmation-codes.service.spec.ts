import { Test, TestingModule } from "@nestjs/testing";
import { EmailConfirmationCodesService } from "./email-confirmation-codes.service";

describe("EmailConfirmationCodesService", () => {
  let service: EmailConfirmationCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailConfirmationCodesService],
    }).compile();

    service = module.get<EmailConfirmationCodesService>(EmailConfirmationCodesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
