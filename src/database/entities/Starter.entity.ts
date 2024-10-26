import { Entity, PrimaryKey } from "@mikro-orm/core";

@Entity({
  tableName: "starter",
})
export class StarterEntity {
  @PrimaryKey({ type: "uuid" })
  public uuid!: string;
}
