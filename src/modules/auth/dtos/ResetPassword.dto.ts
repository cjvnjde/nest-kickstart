import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class ResetPasswordDto {
  @ApiProperty({ example: "strongPassword123", description: "User's password" })
  @IsString({
    message: i18nValidationMessage("validation.isString"),
  })
  password: string;

  @ApiProperty({ example: "123456", description: "Password reset code" })
  @IsString({
    message: i18nValidationMessage("validation.isString"),
  })
  code: string;
}
