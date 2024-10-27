import { getEnvironment } from "./environment";
import getEmailConfig from "./email";
import getBullConfig from "./bull";

export type Configuration = {
  environment: ReturnType<typeof getEnvironment>;
  email: ReturnType<typeof getEmailConfig>;
  bull: ReturnType<typeof getBullConfig>;
  isDevelopment: boolean;
};

export default (environment: Record<string, unknown>): Configuration => {
  const env = getEnvironment(environment);
  const email = getEmailConfig(env);
  const bull = getBullConfig(env);

  return {
    environment: env,
    email,
    bull,
    isDevelopment: process.env.NODE_ENV !== "production",
  };
};
