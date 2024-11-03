import { Module } from "@nestjs/common";
import { EmailConfirmationCodesService } from "./email-confirmation-codes.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { EmailConfirmationCodeEntity } from "../../database/entities";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [EmailConfirmationCodeEntity] })],
  providers: [EmailConfirmationCodesService],
  exports: [EmailConfirmationCodesService],
})
export class EmailConfirmationCodesModule {}
