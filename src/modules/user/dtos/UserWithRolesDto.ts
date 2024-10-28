import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsUUID, ValidateNested } from "class-validator";
import { RoleDto } from "../../policies/dto/Role.dto";

export class UserWithRolesDto {
  @ApiProperty({ example: "uuid-value", description: "User's unique identifier" })
  @IsUUID()
  uuid: string;

  @ApiProperty({ example: "user@example.com", description: "User's email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ type: [RoleDto] })
  @ValidateNested({ each: true })
  @Type(() => RoleDto)
  roles: RoleDto[];

  constructor(partial: Partial<UserWithRolesDto>) {
    this.uuid = partial.uuid;
    this.email = partial.email;
    this.roles = partial.roles?.map((role) => new RoleDto(role)) || [];
  }
}
