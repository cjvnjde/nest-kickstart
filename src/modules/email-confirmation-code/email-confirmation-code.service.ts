import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { EmailConfirmationCodeEntity } from "../../database/entities";
import { generateCode } from "../../utils/generateCode";
import { UserDto } from "../user/dtos/User.dto";

@Injectable()
export class EmailConfirmationCodeService {
  constructor(
    @InjectRepository(EmailConfirmationCodeEntity)
    private readonly emailConfirmationCodeRepository: EntityRepository<EmailConfirmationCodeEntity>,
    private readonly em: EntityManager,
  ) {}

  findOne(code: string) {
    return this.emailConfirmationCodeRepository.findOneOrFail(
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

    const emailConfirmationCode = this.emailConfirmationCodeRepository.create({
      email: user.email,
      code,
      user: user.uuid,
    });

    await this.em.persistAndFlush(emailConfirmationCode);

    return code;
  }
}
