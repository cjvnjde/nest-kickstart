import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class VerifyCodeDto {
  @ApiProperty({ example: "123456", description: "Email confirmation code." })
  @IsString({
    message: i18nValidationMessage("validation.isString"),
  })
  code: string;
}
