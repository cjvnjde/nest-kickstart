import { Controller, Get } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";

@Controller("ping")
export class PingController {
  constructor(private readonly i18n: I18nService) {}

  @Get()
  ping() {
    return this.i18n.t("ping.pong");
  }
}
