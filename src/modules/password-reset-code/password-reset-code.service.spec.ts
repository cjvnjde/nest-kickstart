import { Test, TestingModule } from "@nestjs/testing";
import { PasswordResetCodeService } from "./password-reset-code.service";

describe("PasswordResetCodeService", () => {
  let service: PasswordResetCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordResetCodeService],
    }).compile();

    service = module.get<PasswordResetCodeService>(PasswordResetCodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
