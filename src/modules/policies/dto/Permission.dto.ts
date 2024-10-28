import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class PermissionDto {
  @ApiProperty({ example: "uuid-value", description: "User's unique identifier" })
  @IsUUID()
  uuid: string;

  @ApiProperty()
  @IsString()
  action: string;

  @ApiProperty()
  @IsString()
  subject: string;

  constructor(partial: Partial<PermissionDto>) {
    this.uuid = partial.uuid;
    this.action = partial.action;
    this.subject = partial.subject;
  }
}
