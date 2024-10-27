import { UnprocessableEntityException, ValidationError } from "@nestjs/common";
import { exceptionFormatter } from "./exceptionFormatter";

type NestedValidationErrors = { [key: string]: string | NestedValidationErrors };

export function exceptionFactory(errors: ValidationError[]) {
  const formatErrors = (errors: ValidationError[]): NestedValidationErrors => {
    return errors.reduce((result, error) => {
      if (error.children && error.children.length > 0) {
        result[error.property] = formatErrors(error.children);
      } else if (error.constraints) {
        result[error.property] = Object.values(error.constraints)[0];
      }
      return result;
    }, {} as NestedValidationErrors);
  };

  return new UnprocessableEntityException(
    exceptionFormatter({
      message: "Validation failed for one or more fields.",
      details: formatErrors(errors),
    }),
  );
}
