import { Module } from '@nestjs/common';
import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from '@user/user.module';
import { DatabaseModule } from '@database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
    UserModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
