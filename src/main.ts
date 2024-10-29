import { INestApplication, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { I18nMiddleware, I18nValidationPipe } from "nestjs-i18n";
import type { Configuration } from "./config/configuration";
import { DBValidationExceptionFilter } from "./filters/DBValidationException.filter";
import { GlobalExceptionsFilter } from "./filters/GlobalException.filter";
import { I18nValidationExceptionFilter } from "./filters/I18nValidationException.filter";
import { RootModule } from "./modules/root.module";

function enableSwagger(app: INestApplication, env: Configuration["environment"]) {
  const port = env.PORT;
  const isDevelopment = true;
  const swaggerPrefix = "swagger";

  const swaggerDocument = new DocumentBuilder().setTitle("Kickstart").setDescription("The kickstart API description").setVersion("1.0");

  if (isDevelopment) {
    swaggerDocument.addServer(`http://localhost:${port}`);
  }

  const document = SwaggerModule.createDocument(app, swaggerDocument.build());

  SwaggerModule.setup(swaggerPrefix, app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  app.use(I18nMiddleware);
  const configService = app.get(ConfigService);
  const envParams = configService.get<Configuration["environment"]>("environment");
  const isDevelopment = configService.get<Configuration["isDevelopment"]>("isDevelopment");

  app.use(cookieParser(envParams.COOKIE_SECRET));

  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(new GlobalExceptionsFilter(), new DBValidationExceptionFilter(), new I18nValidationExceptionFilter());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  if (isDevelopment) {
    enableSwagger(app, envParams);
  }

  await app.listen(envParams.PORT, "0.0.0.0");
}

bootstrap();
