import { ExecutionContext, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { I18nContext, I18nService } from "nestjs-i18n";
import { exceptionFormatter } from "../../../utils/exceptionFormatter";
import { formatI18nErrors } from "../../../utils/formatI18nErrors";
import { LoginDto } from "../dtos/Login.dto";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  constructor(private i18nService: I18nService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const i18n = I18nContext.current();
    const body = plainToInstance(LoginDto, request.body);
    const errors = await validate(body);

    if (errors.length > 0) {
      throw new UnprocessableEntityException(
        exceptionFormatter({
          message: i18n.service.t("exceptions.validationFailed"),
          details: formatI18nErrors(errors ?? [], i18n.service, {
            lang: i18n.lang,
          }),
        }),
      );
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
