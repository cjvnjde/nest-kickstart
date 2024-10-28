import { Injectable, NotFoundException } from "@nestjs/common";
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
    return await this.userRepository.findOne({
      uuid,
    });
  }

  async findByUuidOrFail(uuid: string) {
    const user = await this.findByUuid(uuid);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      email,
    });
  }

  async findByEmailOrFail(email: string) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async create(userData: CreateUserDto) {
    const newUser = this.userRepository.create(userData);
    newUser.password = createHash(userData.password);

    await this.em.persistAndFlush(newUser);
  }

  async updatePassword(user: UserDto, newPassword: string) {
    await this.userRepository.nativeUpdate({ uuid: user.uuid }, { password: createHash(newPassword) });
  }

  async confirmEmail(user: UserDto) {
    await this.userRepository.nativeUpdate({ uuid: user.uuid }, { emailVerifiedAt: new Date() });
  }

  async updateRefreshToken(user: UserDto, newRefreshToken: string) {
    await this.userRepository.nativeUpdate({ uuid: user.uuid }, { refreshToken: createHash(newRefreshToken) });
  }
}
