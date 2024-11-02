import { Module } from "@nestjs/common";
import { FilestoreService } from "./filestore.service";
import { NestMinioModule } from "nestjs-minio";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Configuration } from "src/config/configuration";

@Module({
  imports: [
    NestMinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get<Configuration["filestore"]>("filestore"),
      inject: [ConfigService],
    }),
  ],
  providers: [FilestoreService],
  exports: [FilestoreService],
})
export class FilestoreModule {}
