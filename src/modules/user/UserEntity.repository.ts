import { EntityRepository, FilterQuery, FindOptions } from "@mikro-orm/core";
import { UserEntity } from "../../database/entities";

export class UserEntityRepository extends EntityRepository<UserEntity> {
  async getPaginatedResults(where: FilterQuery<UserEntity>, options: FindOptions<UserEntity> & { limit: number; offset: number }) {
    const [results, total] = await this.findAndCount(where, {
      orderBy: { createdAt: "DESC" },
      ...options,
    });

    return {
      results,
      total,
      pageCount: Math.ceil(total / options.limit),
      currentPage: Math.floor(options.offset / options.limit) + 1,
    };
  }
}
