export function exceptionFormatter(exception?: unknown) {
  if (exception === undefined) {
    return {
      message: "Unknown error",
      details: {},
    };
  }

  if (typeof exception === "string") {
    return {
      message: exception,
      details: {},
    };
  }

  if (typeof exception === "object" && exception !== null) {
    if ("message" in exception && "details" in exception) {
      return exception;
    }

    if ("message" in exception) {
      return {
        message: exception.message,
        details: {},
      };
    }
  }
}
