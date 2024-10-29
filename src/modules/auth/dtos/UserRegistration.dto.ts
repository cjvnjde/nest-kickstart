import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class UserRegistrationDto {
  @ApiProperty({ example: "user@example.com", description: "User's email address" })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage("validation.isEmail"),
    },
  )
  email: string;

  @ApiProperty({ example: "strongPassword123", description: "User's password" })
  @IsString({
    message: i18nValidationMessage("validation.isString"),
  })
  password: string;
}
