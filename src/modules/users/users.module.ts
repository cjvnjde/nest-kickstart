import { Module } from "@nestjs/common";
import { RolesModule } from "../roles/roles.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserEntity } from "../../database/entities";

@Module({
  imports: [RolesModule, MikroOrmModule.forFeature({ entities: [UserEntity] })],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
