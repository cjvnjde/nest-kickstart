import { IsIn, IsInt, IsString, validateSync } from "class-validator";
import { plainToInstance } from "class-transformer";

class Environment {
  @IsString()
  MAIN_DB: string;

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
  EMAIL_USER: string;

  @IsString()
  EMAIL_PASSWORD: string;

  @IsString()
  IDP_AUTHORITY: string;

  @IsIn(["jwt-profile"] as const)
  IDP_AUTHORIZATION_TYPE: "jwt-profile";

  @IsIn(["application"] as const)
  IDP_AUTHORIZATION_PROFILE_TYPE: "application";

  @IsString()
  IDP_AUTHORIZATION_PROFILE_KEY_ID: string;

  @IsString()
  IDP_AUTHORIZATION_PROFILE_KEY: string;

  @IsString()
  IDP_AUTHORIZATION_PROFILE_APP_ID: string;

  @IsString()
  IDP_AUTHORIZATION_PROFILE_CLIENT_ID: string;

  @IsString()
  OPENAPI_CLIENT_ID: string;

  @IsString()
  OPENAPI_CLIENT_SECRET: string;
}

export function getEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(Environment, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
