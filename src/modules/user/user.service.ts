import { EntityManager } from "@mikro-orm/core";
import { Injectable, NotFoundException } from "@nestjs/common";
import { createHash } from "../../utils/createHash";
import { PoliciesService } from "../policies/policies.service";
import type { CreateUserDto } from "./dtos/CreateUser.dto";
import { UserDto } from "./dtos/User.dto";
import { UserEntityRepository } from "./UserEntity.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserEntityRepository,
    private readonly em: EntityManager,
    private readonly policiesService: PoliciesService,
  ) {}

  async findAll(userData: UserDto, limit: number, offset: number) {
    return this.userRepository.getPaginatedResults(
      {
        uuid: { $ne: userData.uuid },
      },
      {
        limit,
        offset,
      },
    );
  }

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
