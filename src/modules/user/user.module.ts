import { Module } from "@nestjs/common";
import { PoliciesModule } from "../policies/policies.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserEntity } from "../../database/entities";

@Module({
  imports: [PoliciesModule, MikroOrmModule.forFeature({ entities: [UserEntity] })],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
