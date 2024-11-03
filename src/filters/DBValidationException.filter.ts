import { ValidationError } from "@mikro-orm/core";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";
import { I18nContext } from "nestjs-i18n";
import { exceptionFormatter } from "../utils/formatters/exceptionFormatter";

@Catch(ValidationError)
export class DBValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger("ExceptionsFilter");

  catch(exception: ValidationError, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const i18n = I18nContext.current();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json(
      exceptionFormatter({
        message: i18n.service.t("exceptions.validationFailed"),
      }),
    );
  }
}
