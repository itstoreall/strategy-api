import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  init(): string {
    const init = this.appService.init();
    return `${init} /`;
  }

  @Get('/api')
  api(): string {
    const init = this.appService.init();
    return `${init} /api`;
  }
}
