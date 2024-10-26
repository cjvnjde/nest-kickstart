import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";

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
  @Get()
  ping() {
    return new PingResponseDto({
      message: "pong",
    });
  }
}
