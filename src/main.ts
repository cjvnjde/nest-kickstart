import { NestFactory } from "@nestjs/core";
import { RootModule } from "./modules/root.module";
import { ConfigService } from "@nestjs/config";
import type { Configuration } from "./config/configuration";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication, VersioningType } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

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

  const configService = app.get(ConfigService);
  const envParams = configService.get<Configuration["environment"]>("environment");

  app.use(cookieParser(envParams.COOKIE_SECRET));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  enableSwagger(app, envParams);

  await app.listen(envParams.PORT, "0.0.0.0");
}

bootstrap();
