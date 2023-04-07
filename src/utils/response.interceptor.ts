import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IResponseBase } from '@interfaces/index';

@Injectable()
export default class TransformResponseInterceptor<T>
  implements NestInterceptor<T, IResponseBase<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponseBase<T>> {
    return next.handle().pipe(
      map((res) => {
        const { errorCode, message, data } = res;
        return {
          errorCode,
          message,
          data,
        };
      }),
    );
  }
}
