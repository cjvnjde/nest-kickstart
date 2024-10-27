import type { Configuration } from "./configuration";

const getBullConfig = (env: Configuration["environment"]) => {
  return {
    connection: {
      host: env.BULL_HOST,
      port: env.BULL_PORT,
    },
  };
};

export default getBullConfig;
