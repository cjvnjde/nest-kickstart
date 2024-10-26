import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { ConfigService } from "@nestjs/config";
import { Configuration } from "./config/configuration";
import { VersioningType } from "@nestjs/common";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { I18nValidationExceptionFilter, I18nValidationPipe } from "nestjs-i18n";

function enableSwagger(app: NestFastifyApplication) {
  const config = new DocumentBuilder().setTitle("Kickstart").setDescription("The kickstart API description").setVersion("1.0").build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, documentFactory);
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
  enableSwagger(app);

  await app.listen({
    port: envParams.PORT,
    host: "0.0.0.0",
  });
}

bootstrap();
