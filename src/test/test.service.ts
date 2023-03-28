import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  testAbc() {
    return 'test ok';
  }
}
