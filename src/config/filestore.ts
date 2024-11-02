import type { Configuration } from "./configuration";

const getFilestore = (env: Configuration["environment"], isDevelopment: boolean) => {
  return {
    endPoint: env.FILESTORE_ENDPOINT,
    port: env.FILESTORE_PORT,
    useSSL: !isDevelopment,
    accessKey: env.FILESTORE_ACCESS_KEY,
    secretKey: env.FILESTORE_SECRET_KEY,
  };
};

export default getFilestore;
