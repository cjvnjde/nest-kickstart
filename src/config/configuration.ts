import { getEnvironment } from "./environment";
import getEmailConfig from "./email";

export type Configuration = {
  environment: ReturnType<typeof getEnvironment>;
  email: ReturnType<typeof getEmailConfig>;
  fallbackLanguage: string;
};

export default (environment: Record<string, unknown>): Configuration => {
  const env = getEnvironment(environment);
  const email = getEmailConfig(env);

  return {
    environment: env,
    email,
    fallbackLanguage: "en",
  };
};
