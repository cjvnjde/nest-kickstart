import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsUUID } from "class-validator";

export class UserDto {
  @ApiProperty({ example: "uuid-value", description: "User's unique identifier" })
  @IsUUID()
  uuid: string;

  @ApiProperty({ example: "user@example.com", description: "User's email address" })
  @IsEmail()
  email: string;

  constructor(partial: Partial<UserDto>) {
    this.uuid = partial.uuid;
    this.email = partial.email;
  }
}
