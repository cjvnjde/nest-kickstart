import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserEntity } from "../../database/entities";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [UserEntity] })],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
