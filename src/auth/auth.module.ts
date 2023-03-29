import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AccountEntity from '@models/account.entity';

import AuthController from './auth.controller';
import AuthService from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
