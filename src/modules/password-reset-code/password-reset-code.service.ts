import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { PasswordResetCodeEntity } from "../../database/entities/PasswordResetCode.entity";
import { generateCode } from "../../utils/generateCode";
import { UserService } from "../user/user.service";

@Injectable()
export class PasswordResetCodeService {
  constructor(
    @InjectRepository(PasswordResetCodeEntity)
    private readonly passwordResetCodeRepository: EntityRepository<PasswordResetCodeEntity>,
    private readonly em: EntityManager,
    private readonly userService: UserService,
  ) {}

  findOne(code: string) {
    return this.passwordResetCodeRepository.findOneOrFail(
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

    const user = await this.userService.findByEmailOrFail(email);
    const passwordResetCode = this.passwordResetCodeRepository.create({
      code,
      user,
    });

    await this.em.persistAndFlush(passwordResetCode);

    return code;
  }
}
