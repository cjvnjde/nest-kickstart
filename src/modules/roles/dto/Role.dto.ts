import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsUUID, ValidateNested } from "class-validator";
import { PermissionDto } from "./Permission.dto";
import { PartialDeep } from "../../../types/PartialDeep";

export class RoleDto {
  @ApiProperty({ example: "uuid-value", description: "Role's unique identifier" })
  @IsUUID()
  uuid: string;

  @ApiProperty({ example: "admin", description: "Name of the role" })
  @IsString()
  name: string;

  @ApiProperty({
    type: [PermissionDto],
    description: "List of permissions assigned to the role",
  })
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];

  constructor(partial: PartialDeep<RoleDto>) {
    this.uuid = partial.uuid;
    this.name = partial.name;
    this.permissions = partial.permissions?.map((permission) => new PermissionDto(permission)) || [];
  }
}
