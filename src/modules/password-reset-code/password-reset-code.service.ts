import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { PasswordResetCodeEntity } from "../../database/entities";
import { generateCode } from "../../utils/generateCode";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";
import { addMilliseconds } from "date-fns";
import { Configuration } from "../../config/configuration";

@Injectable()
export class PasswordResetCodeService {
  constructor(
    @InjectRepository(PasswordResetCodeEntity)
    private readonly passwordResetCodeRepository: EntityRepository<PasswordResetCodeEntity>,
    private readonly em: EntityManager,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  findOne(code: string) {
    return this.passwordResetCodeRepository.findOne(
      {
        code,
      },
      {
        populate: ["user"],
      },
    );
  }

  async create(email: string) {
    const code = generateCode(6);
    const environment = this.configService.get<Configuration["environment"]>("environment");
    const createdAt = new Date();

    const user = await this.userService.findByEmailOrFail(email);
    const passwordResetCode = this.passwordResetCodeRepository.create({
      code,
      createdAt,
      expiresAt: addMilliseconds(createdAt, environment.EMAIL_CODE_EXPIRE_TIME_MS),
      user,
    });

    await this.em.persistAndFlush(passwordResetCode);

    return code;
  }
}
