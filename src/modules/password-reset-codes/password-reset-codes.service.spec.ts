import { Test, TestingModule } from "@nestjs/testing";
import { PasswordResetCodesService } from "./password-reset-codes.service";

describe("PasswordResetCodesService", () => {
  let service: PasswordResetCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordResetCodesService],
    }).compile();

    service = module.get<PasswordResetCodesService>(PasswordResetCodesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
