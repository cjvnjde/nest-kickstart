import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { I18nContext, I18nValidationException } from "nestjs-i18n";
import { exceptionFormatter } from "../utils/formatters/exceptionFormatter";
import { formatI18nErrors } from "../utils/formatters/formatI18nErrors";

@Catch(I18nValidationException)
export class I18nValidationExceptionFilter implements ExceptionFilter {
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const i18n = I18nContext.current();

    const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
      lang: i18n.lang,
    });

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).send(
      exceptionFormatter({
        message: i18n.service.t("exceptions.validationFailed"),
        details: errors,
      }),
    );
  }
}
