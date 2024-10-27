import { Module } from "@nestjs/common";
import { PasswordResetCodeService } from "./password-reset-code.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PasswordResetCodeEntity } from "../../database/entities/PasswordResetCode.entity";
import { UserModule } from "../user/user.module";

@Module({
  imports: [UserModule, MikroOrmModule.forFeature({ entities: [PasswordResetCodeEntity] })],
  providers: [PasswordResetCodeService],
  exports: [PasswordResetCodeService],
})
export class PasswordResetCodeModule {}
