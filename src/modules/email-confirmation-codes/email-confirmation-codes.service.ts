import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { EmailConfirmationCodeEntity } from "../../database/entities";
import { generateCode } from "../../utils/generateCode";
import { UserDto } from "../users/dtos/User.dto";
import { ConfigService } from "@nestjs/config";
import { Configuration } from "../../config/configuration";
import { addMilliseconds } from "date-fns";

@Injectable()
export class EmailConfirmationCodesService {
  constructor(
    @InjectRepository(EmailConfirmationCodeEntity)
    private readonly emailConfirmationCodeRepository: EntityRepository<EmailConfirmationCodeEntity>,
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  findOneWithUser(code: string) {
    return this.emailConfirmationCodeRepository.findOne(
      {
        code,
      },
      {
        populate: ["user"],
      },
    );
  }

  async create(user: UserDto) {
    const code = generateCode(6);
    const environment = this.configService.get<Configuration["environment"]>("environment");

    const createdAt = new Date();
    const emailConfirmationCode = this.emailConfirmationCodeRepository.create({
      email: user.email,
      code,
      createdAt,
      expiresAt: addMilliseconds(createdAt, environment.EMAIL_CODE_EXPIRE_TIME_MS),
      user: user.uuid,
    });

    await this.em.persistAndFlush(emailConfirmationCode);

    return code;
  }
}
