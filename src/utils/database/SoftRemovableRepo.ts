import { EntityRepository } from "@mikro-orm/core";
import { SoftRemovableEntity } from "./SoftRemovableEntity";

export class SoftRemovableRepo<T extends SoftRemovableEntity> extends EntityRepository<T> {
  softDelete(entity: T) {
    if (entity.deletedAt === null) {
      entity.deletedAt = new Date();
    }

    return this;
  }

  restore(entity: T) {
    if (entity.deletedAt !== null) {
      entity.deletedAt = null;
    }

    return this;
  }
}
