// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Strategy } from "passport";
import { Request } from "express";
import * as jwt from "jsonwebtoken";

export class JwtCookieStrategy extends Strategy {
  name = "jwt-cookie";

  constructor(
    private readonly options: {
      secretOrKey: string;
      accessCookieName: string;
      refreshCookieName: string;
    },
    private readonly verify: (req: Request, data: unknown, cb: (err: unknown, data: unknown) => void) => Promise<unknown>,
  ) {
    super();
  }

  authenticate(req: Request) {
    const access = req.cookies?.[this.options.accessCookieName];
    const refresh = req.cookies?.[this.options.refreshCookieName];

    if (!refresh) {
      return this.fail(new Error("No auth token"));
    }

    const jwtVerifyOptions = {};

    jwt.verify(access, this.options.secretOrKey, jwtVerifyOptions, (_, decoded) => {
      try {
        this.verify(req, decoded, (err, user) => {
          if (err) {
            return this.error(err);
          } else if (!user) {
            return this.fail();
          } else {
            return this.success(user);
          }
        });
      } catch (ex) {
        this.error(ex);
      }
    });
  }
}
