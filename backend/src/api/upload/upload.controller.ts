import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
@UseGuards(AuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 100 }), new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const fileUrl = await this.uploadService.uploadFile(file);
      return {
        data: { fileUrl },
      };
    } catch (error) {
      return {
        msg: error.message,
      };
    }
  }
}
