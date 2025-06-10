import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('send')
  async send(@Body('content') content: string) {
    return this.appService.sendMessage(content);
  }
}
