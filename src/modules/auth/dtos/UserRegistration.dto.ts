import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserRegistrationDto {
  @ApiProperty({ example: "user@example.com", description: "User's email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "strongPassword123", description: "User's password" })
  @IsString()
  password: string;
}
