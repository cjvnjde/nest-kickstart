import { getEnvironment } from "./environment";
import getEmailConfig from "./email";
import getBullConfig from "./bull";
import getFilestore from "./filestore";

export type Configuration = {
  environment: ReturnType<typeof getEnvironment>;
  email: ReturnType<typeof getEmailConfig>;
  bull: ReturnType<typeof getBullConfig>;
  filestore: ReturnType<typeof getFilestore>;
  isDevelopment: boolean;
};

export default (environment: Record<string, unknown>): Configuration => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const env = getEnvironment(environment);
  const email = getEmailConfig(env);
  const bull = getBullConfig(env);
  const filestore = getFilestore(env, isDevelopment);

  return {
    environment: env,
    email,
    bull,
    filestore,
    isDevelopment,
  };
};
