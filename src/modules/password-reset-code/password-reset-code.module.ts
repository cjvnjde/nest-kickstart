import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PasswordResetCodeEntity } from "../../database/entities";
import { UserModule } from "../user/user.module";
import { PasswordResetCodeService } from "./password-reset-code.service";

@Module({
  imports: [UserModule, MikroOrmModule.forFeature({ entities: [PasswordResetCodeEntity] })],
  providers: [PasswordResetCodeService],
  exports: [PasswordResetCodeService],
})
export class PasswordResetCodeModule {}
