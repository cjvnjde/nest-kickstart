import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../database/entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/core";
import type { CreateUserDto } from "./dtos/CreateUser.dto";
import { createHash } from "../../utils/createHash";
import { UserDto } from "./dtos/User.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
    private readonly em: EntityManager,
  ) {}

  async findByUuid(uuid: string) {
    return this.userRepository.findOne({
      uuid,
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      email,
    });
  }

  async create(userData: CreateUserDto) {
    const newUser = this.userRepository.create(userData);
    newUser.password = createHash(userData.password);

    await this.em.persistAndFlush(newUser);
  }

  async updatePassword(user: UserDto, newPassword: string) {
    const userEntity = await this.findByUuid(user.uuid);
    userEntity.password = createHash(newPassword);

    await this.em.persistAndFlush(userEntity);
  }

  async confirmEmail(user: UserDto) {
    const userEntity = await this.findByUuid(user.uuid);
    userEntity.emailVerifiedAt = new Date();
    await this.em.persistAndFlush(userEntity);
  }
}
