import { I18nService, I18nValidationError, TranslateOptions } from "nestjs-i18n";

function translateValues(values: string[], error: I18nValidationError, i18n: I18nService, options?: TranslateOptions) {
  return values.map((value) => {
    const [translationKey, argsString] = value.split("|");
    const args = !!argsString ? JSON.parse(argsString) : {};
    const constraints = args.constraints
      ? args.constraints.reduce((acc: object, cur: any, index: number) => {
          acc[index.toString()] = cur;
          return acc;
        }, {})
      : error.constraints;

    return i18n.translate(translationKey, {
      ...options,
      args: {
        property: error.property,
        value: error.value,
        target: error.target,
        contexts: error.contexts,
        ...args,
        constraints,
      },
    });
  });
}

export function formatI18nErrors(errors: I18nValidationError[], i18n: I18nService, options?: TranslateOptions) {
  const result: Record<string, any> = {};

  errors.forEach((error) => {
    const { property, constraints, children } = error;

    if (constraints) {
      result[property] = translateValues(Object.values(constraints), error, i18n, options);
    }

    if (children && children.length > 0) {
      result[property] = formatI18nErrors(children, i18n, options);
    } else if (constraints) {
      result[property] = translateValues(Object.values(constraints), error, i18n, options);
    }
  });

  return result;
}
