import { HttpException, InternalServerErrorException } from '@nestjs/common';

import { errorMessages } from '@constants';

export default class CatchError extends Error {
  constructor(error: any) {
    super();
    if (error instanceof HttpException) {
      throw error;
    } else {
      console.error(error);
      throw new InternalServerErrorException(
        errorMessages.SOME_THING_WENT_WRONG,
      );
    }
  }
}
