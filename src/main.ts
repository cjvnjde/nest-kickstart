import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { ConfigService } from "@nestjs/config";
import { Configuration } from "./config/configuration";
import { VersioningType } from "@nestjs/common";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { I18nValidationExceptionFilter, I18nValidationPipe } from "nestjs-i18n";

function enableSwagger(app: NestFastifyApplication, env: Configuration["environment"]) {
  const authority = env.IDP_AUTHORITY;
  const port = env.PORT;
  const clientId = env.OPENAPI_CLIENT_ID;
  const clientSecret = env.OPENAPI_CLIENT_SECRET;
  const scopes: string[] = ["openid", "profile", "email", "offline_access"];
  const isDevelopment = true;
  const swaggerPrefix = "swagger";

  const swaggerDocument = new DocumentBuilder()
    .setTitle("Kickstart")
    .setDescription("The kickstart API description")
    .setVersion("1.0")
    .addSecurity("zitadel-jwt", {
      type: "openIdConnect",
      openIdConnectUrl: `${authority}/.well-known/openid-configuration`,
      name: "Zitadel",
    });

  let redirectUri: string;

  if (isDevelopment) {
    swaggerDocument.addServer(`http://localhost:${port}`);
    redirectUri = `http://localhost:${port}/${swaggerPrefix}`;
  } else {
    redirectUri = "YOUR PROD URL HERE";
    throw new Error("SET YOUR PROD URL HERE AND REMOVE THIS THROW");
  }
  const document = SwaggerModule.createDocument(app, swaggerDocument.build());

  SwaggerModule.setup(swaggerPrefix, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      oauth2RedirectUrl: `${redirectUri}/oauth2-redirect.html`,
      initOAuth: {
        clientId,
        clientSecret,
        scopes,
      },
    },
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const configService = app.get(ConfigService);
  const envParams = configService.get<Configuration["environment"]>("environment");
  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: true,
      responseBodyFormatter: (_host, _exc, error) => ({
        message: error,
      }),
    }),
  );

  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });
  enableSwagger(app, envParams);

  await app.listen({
    port: envParams.PORT,
    host: "0.0.0.0",
  });
}

bootstrap();
