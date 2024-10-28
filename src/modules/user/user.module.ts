import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { UserEntity } from "../../database/entities";
import { PoliciesModule } from "../policies/policies.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [PoliciesModule, MikroOrmModule.forFeature({ entities: [UserEntity] })],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
