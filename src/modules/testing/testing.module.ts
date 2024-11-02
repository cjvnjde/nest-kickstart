import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import { FilestoreModule } from "../filestore/filestore.module";

@Module({
  imports: [FilestoreModule],
  controllers: [TestingController],
})
export class TestingModule {}
