import { Property } from "@mikro-orm/core";

export abstract class SoftRemovableEntity {
  @Property({ type: Date, nullable: true, default: null })
  deletedAt: Date | null = null;
}
