import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

class PingResponseDto {
  @ApiProperty({ example: "pong" })
  message: string;

  constructor(partial: Partial<PingResponseDto>) {
    Object.assign(this, partial);
  }
}

@ApiTags("Ping")
@Controller("ping")
export class PingController {
  @ApiOperation({ summary: "Ping the server" })
  @ApiResponse({
    status: 200,
    description: "Returns a pong response.",
    type: PingResponseDto,
  })
  @ApiBearerAuth("zitadel-jwt")
  @UseGuards(AuthGuard("zitadel-jwt"))
  @Get()
  ping() {
    return new PingResponseDto({
      message: "pong",
    });
  }
}
