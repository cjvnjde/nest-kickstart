import { Module } from "@nestjs/common";
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from "./access-control.module-definition";
import { PassportModule } from "@nestjs/passport";
import { ZitadelStrategy } from "./strategy/zitadel.strategy";

@Module({
  imports: [PassportModule],
  providers: [
    {
      provide: MODULE_OPTIONS_TOKEN,
      useValue: MODULE_OPTIONS_TOKEN,
    },
    ZitadelStrategy,
  ],
  exports: [ZitadelStrategy],
})
export class AccessControlModule extends ConfigurableModuleClass {}
