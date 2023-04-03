import { VersioningType, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import TransformInterceptor from '@utils/response.interceptor';
import { BadRequestExceptionFilter } from '@utils/badRequestExceptionFilter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new BadRequestExceptionFilter());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
  });

  await app.listen(3000);
}
bootstrap();
