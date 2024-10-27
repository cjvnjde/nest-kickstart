import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyCodeDto {
  @ApiProperty({ example: "123456", description: "Email confirmation code." })
  @IsString()
  code: string;
}
