import { plainToInstance } from "class-transformer";
import { IsInt, IsString, validateSync } from "class-validator";

class Environment {
  @IsString()
  DATABASE: string;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_HOST: string;

  @IsInt()
  POSTGRES_PORT: number;

  @IsInt()
  PORT: number;

  @IsString()
  JWT_ACCESS_TOKEN_SECRET: string;

  @IsInt()
  JWT_ACCESS_TOKEN_EXPIRATION_TIME_MS: number;

  @IsString()
  JWT_REFRESH_TOKEN_SECRET: string;

  @IsInt()
  JWT_REFRESH_TOKEN_EXPIRATION_TIME_MS: number;

  @IsString()
  ACCESS_TOKEN_COOKIE: string;

  @IsString()
  REFRESH_TOKEN_COOKIE: string;

  @IsString()
  COOKIE_SECRET: string;

  @IsInt()
  EMAIL_CODE_EXPIRE_TIME_MS: number;

  @IsString()
  SMTP_HOST: string;

  @IsInt()
  SMTP_PORT: number;

  @IsString()
  SMTP_USER: string;

  @IsString()
  SMTP_PASS: string;

  @IsInt()
  BULL_PORT: number;

  @IsString()
  BULL_HOST: string;

  @IsString()
  FILESTORE_ACCESS_KEY: string;

  @IsString()
  FILESTORE_SECRET_KEY: string;

  @IsString()
  FILESTORE_ENDPOINT: string;

  @IsInt()
  FILESTORE_PORT: number;
}

export function getEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(Environment, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error("Environment validation failed");
  }

  return validatedConfig;
}
