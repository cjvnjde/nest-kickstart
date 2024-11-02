import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FilestoreService } from "../filestore/filestore.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

@Controller("testing")
@UseGuards(JwtAuthGuard)
export class TestingController {
  constructor(private readonly filestoreService: FilestoreService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.filestoreService.uploadFile(file);

    const fileUrl = await this.filestoreService.getFileUrl(result.objectName, result.bucketName);

    return {
      url: fileUrl,
    };
  }
}
