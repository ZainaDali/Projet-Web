import { Controller, Get } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('health')
export class HealthController {
  constructor(@InjectQueue('message') private readonly messageQueue: Queue) {}

  @Get()
  check(): string {
    return 'OK';
  }

  @Get('job')
  async createJob(): Promise<string> {
    await this.messageQueue.add({ text: 'Hello from health check!' });
    return 'Job added to queue';
  }
}
