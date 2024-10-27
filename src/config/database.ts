import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { SeedManager } from "@mikro-orm/seeder";
import * as entities from "../database/entities";
import { ConfigService } from "@nestjs/config";
import configuration, { Configuration } from "./configuration";
import * as dotenv from "dotenv";

dotenv.config();

const configService = new ConfigService(configuration(process.env));
const envParams = configService.get<Configuration["environment"]>("environment");

const databaseConfig = defineConfig({
  entities: Object.values(entities),
  extensions: [Migrator, SeedManager],
  dbName: envParams.DATABASE,
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
  seeder: {
    path: "dist/database/seeds",
    pathTs: "src/database/seeds",
    emit: "ts",
  },
});

export default databaseConfig;
