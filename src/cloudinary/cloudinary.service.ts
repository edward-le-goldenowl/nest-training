import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import toStream = require('buffer-to-stream');

import { errorMessages, errorCodes } from '@constants';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    v2.config({
      cloud_name: configService.get('CLOUDINARY_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
    });
  }
  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<Partial<UploadApiResponse | UploadApiErrorResponse>> {
    return new Promise((resolve, reject) => {
      const timestamp = new Date().toISOString();
      const newName = `${timestamp}-${file.originalname}`;
      const upload = v2.uploader.upload_stream(
        { public_id: `${folder}/${newName}` },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            throw new BadRequestException(errorMessages.UPLOAD_FILE_FAILED, {
              cause: new Error(),
              description: errorCodes.ERR_UPLOAD_FILE_FAILED,
            });
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
