import { Module } from "@nestjs/common";
import { EmailConfirmationCodeService } from "./email-confirmation-code.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { EmailConfirmationCodeEntity } from "../../database/entities/EmailConfirmationCode.entity";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [EmailConfirmationCodeEntity] })],
  providers: [EmailConfirmationCodeService],
  exports: [EmailConfirmationCodeService],
})
export class EmailConfirmationCodeModule {}
