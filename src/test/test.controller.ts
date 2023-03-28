import { TestService } from './test.service';
import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Get()
  abc() {
    console.log(`test`);
    return this.testService.testAbc();
  }
}
