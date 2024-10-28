import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsUUID, ValidateNested } from "class-validator";
import { PermissionDto } from "./Permission.dto";

export class RoleDto {
  @ApiProperty({ example: "uuid-value", description: "User's unique identifier" })
  @IsUUID()
  uuid: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [PermissionDto] })
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];

  constructor(partial: Partial<RoleDto>) {
    this.uuid = partial.uuid;
    this.name = partial.name;
    this.permissions = partial.permissions?.map((permission) => new PermissionDto(permission)) || [];
  }
}
