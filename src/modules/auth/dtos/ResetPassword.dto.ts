import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({ example: "strongPassword123", description: "User's password" })
  @IsString()
  password: string;

  @ApiProperty({ example: "123456", description: "Password reset code" })
  @IsString()
  code: string;
}
