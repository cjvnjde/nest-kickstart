import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { LoginDto } from "../dtos/Login.dto";
import { exceptionFactory } from "../../../utils/exceptionFactory";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const body = plainToInstance(LoginDto, request.body);
    const errors = await validate(body);

    if (errors.length > 0) {
      throw exceptionFactory(errors);
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
