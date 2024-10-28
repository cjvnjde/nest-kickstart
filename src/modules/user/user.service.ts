import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserEntity } from "../../database/entities";
import { createHash } from "../../utils/createHash";
import { PoliciesService } from "../policies/policies.service";
import type { CreateUserDto } from "./dtos/CreateUser.dto";
import { UserDto } from "./dtos/User.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
    private readonly em: EntityManager,
    private readonly policiesService: PoliciesService,
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

  async findWithRolesAndPermissionsByUuid(uuid: string) {
    return await this.userRepository.findOne(
      {
        uuid,
      },
      {
        populate: ["roles", "roles.permissions"],
      },
    );
  }

  async findByEmailOrFail(email: string) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async create(userData: CreateUserDto) {
    const userRole = await this.policiesService.findByRole("user");
    const newUser = this.userRepository.create(userData);
    newUser.password = createHash(userData.password);
    newUser.roles.add(userRole);

    await this.em.persistAndFlush(newUser);
  }

  async updatePassword(user: UserDto, newPassword: string) {
    await this.userRepository.nativeUpdate({ uuid: user.uuid }, { password: createHash(newPassword) });
  }

  async confirmEmail(user: UserDto) {
    await this.userRepository.nativeUpdate({ uuid: user.uuid }, { emailVerifiedAt: new Date() });
  }
}
