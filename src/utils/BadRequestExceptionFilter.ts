import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

import { errorMessages } from '@constants/messages';

interface IExceptionResponse {
  statusCode: string;
  message: string | string[];
  error: string;
}

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as IExceptionResponse;
    const message =
      exceptionResponse.message || errorMessages.SOME_THING_WENT_WRONG;
    response.status(status).json({
      ...Object(exceptionResponse),
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
