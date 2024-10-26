import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import * as entities from "../database/entities";
import { ConfigService } from "@nestjs/config";
import configuration, { Configuration } from "./configuration";
import * as dotenv from "dotenv";

dotenv.config();

const configService = new ConfigService(configuration(process.env));
const envParams = configService.get<Configuration["environment"]>("environment");

const databaseConfig = defineConfig({
  entities: Object.values(entities),
  extensions: [Migrator],
  dbName: envParams.MAIN_DB,
  password: envParams.POSTGRES_PASSWORD,
  user: envParams.POSTGRES_USER,
  port: envParams.POSTGRES_PORT,
  host: envParams.POSTGRES_HOST,
  forceUtcTimezone: true,
  debug: true,
  migrations: {
    tableName: "migrations",
    path: "dist/database/migrations",
    pathTs: "src/database/migrations",
    emit: "ts",
  },
});

export default databaseConfig;
