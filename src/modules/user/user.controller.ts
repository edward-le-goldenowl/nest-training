import {
  Body,
  Req,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  HttpCode,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
  ParseFilePipeBuilder,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { successMessages, roles } from '@constants/index';
import { Roles } from '@common/guards/roles.decorator';
import { IResponseBase, IRequest } from '@interfaces/index';
import { AccessTokenGuard, RolesGuard } from '@common/guards';

import { RegisterDTO, UpdateProfileDTO } from './dto/user.dto';
import { IRegisterResponse, IUserProfileResponse } from './user.interface';
import UserService from './user.service';

@ApiTags('User')
@Controller({ path: 'user', version: ['1'] })
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(['/register'])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Register new user' })
  async register(
    @Body() payload: RegisterDTO,
  ): Promise<IResponseBase<{ user: IRegisterResponse }>> {
    const response = await this.userService.create(payload);
    return {
      data: { user: response },
      message: successMessages.SUCCESS,
      error: '',
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get(['/me'])
  @ApiOkResponse({ description: 'Get current user profile' })
  async getProfile(
    @Req() req: IRequest,
  ): Promise<IResponseBase<{ user: IUserProfileResponse }>> {
    const id = req.user?.['id'] || '';
    const response = await this.userService.getUserProfileById(id);
    return {
      data: { user: response },
      message: successMessages.SUCCESS,
      error: '',
    };
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(['/delete/:id'])
  @Roles(roles.ADMIN)
  @ApiOkResponse({ description: 'Delete user by id' })
  async deleteUser(@Param('id') id: string): Promise<IResponseBase<null>> {
    await this.userService.deleteAccountById(id);
    return {
      data: null,
      message: successMessages.SUCCESS,
      error: '',
    };
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('/updateProfile')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOkResponse({ description: 'Update user profile' })
  async updateProfile(
    @Req() req: IRequest,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1000000, //max size: 1000kb
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    avatar: Express.Multer.File,
    @Body() payload: UpdateProfileDTO,
  ): Promise<IResponseBase<{ user: IUserProfileResponse }>> {
    const response = await this.userService.updateUserProfile(
      req,
      avatar,
      payload,
    );
    return {
      data: { user: response },
      message: successMessages.SUCCESS,
      error: '',
    };
  }
}
