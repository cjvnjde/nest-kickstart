import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PasswordResetCodeEntity } from "../../database/entities";
import { UsersModule } from "../users/users.module";
import { PasswordResetCodesService } from "./password-reset-codes.service";

@Module({
  imports: [UsersModule, MikroOrmModule.forFeature({ entities: [PasswordResetCodeEntity] })],
  providers: [PasswordResetCodesService],
  exports: [PasswordResetCodesService],
})
export class PasswordResetCodesModule {}
