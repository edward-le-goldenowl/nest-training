import { VersioningType, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import TransformResponseInterceptor from '@utils/response.interceptor';
import { BadRequestExceptionFilter } from '@utils/badRequestExceptionFilter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  // app.useGlobalInterceptors(new CamelCaseInterceptor());
  app.useGlobalFilters(new BadRequestExceptionFilter());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
  });

  await app.listen(3000);
}
bootstrap();
