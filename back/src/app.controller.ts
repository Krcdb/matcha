import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('test')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.logger.log(`getHelloWorld called`);
    return this.appService.getHello();
  }
}
