import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { RoleEntity } from "../../database/entities";
import { PoliciesService } from "./policies.service";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [RoleEntity] })],
  providers: [PoliciesService],
  exports: [PoliciesService],
})
export class PoliciesModule {}
