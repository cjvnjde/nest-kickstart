import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { ValidationError } from "@mikro-orm/core";
import { exceptionFormatter } from "../utils/exceptionFormatter";

@Catch(ValidationError)
export class DBValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json(
      exceptionFormatter({
        message: "Validation failed for one or more fields.",
      }),
    );
  }
}
