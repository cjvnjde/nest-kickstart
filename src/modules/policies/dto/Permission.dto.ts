import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";
import { PartialDeep } from "../../../types/PartialDeep";

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

  constructor(partial: PartialDeep<PermissionDto>) {
    this.uuid = partial.uuid;
    this.action = partial.action;
    this.subject = partial.subject;
  }
}
