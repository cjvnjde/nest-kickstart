import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserEntity } from "../../../database/entities";
import { UsersService } from "../../users/users.service";
import { compareHash } from "../../../utils/compareHash";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  public async validate(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findByEmailOrFail(email);
    const isValidPassword = Boolean(user) && compareHash(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
