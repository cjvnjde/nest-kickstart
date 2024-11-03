import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";
import { PartialDeep } from "../../../types/PartialDeep";

export class PermissionDto {
  @ApiProperty({ example: "uuid-value", description: "User's unique identifier" })
  @IsUUID()
  uuid: string;

  @ApiProperty({ example: "read", description: "The action the permission grants" })
  @IsString()
  action: string;

  @ApiProperty({ example: "resource", description: "The subject to which the permission applies" })
  @IsString()
  subject: string;

  constructor(partial: PartialDeep<PermissionDto>) {
    this.uuid = partial.uuid;
    this.action = partial.action;
    this.subject = partial.subject;
  }
}
