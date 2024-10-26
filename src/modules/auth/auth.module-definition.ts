import { ConfigurableModuleBuilder } from "@nestjs/common";
import { ZitadelIntrospectionOptions } from "passport-zitadel";

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<ZitadelIntrospectionOptions>()
  .setClassMethodName("forRoot")
  .build();
