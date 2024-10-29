import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class ForgotPasswordDto {
  @ApiProperty({ example: "user@example.com", description: "User's email address" })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage("validation.isEmail"),
    },
  )
  email: string;
}
