import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ZitadelIntrospectionOptions, ZitadelIntrospectionStrategy } from "passport-zitadel";
import { MODULE_OPTIONS_TOKEN } from "../auth.module-definition";

@Injectable()
export class ZitadelStrategy extends PassportStrategy(ZitadelIntrospectionStrategy, "zitadel-jwt") {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    options: ZitadelIntrospectionOptions,
  ) {
    super(options);
  }
}
