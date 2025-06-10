import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(@InjectQueue('message') private messageQueue: Queue) {}

  async sendMessage(content: string) {
    await this.messageQueue.add('send', { content });
    return { status: 'queued', content };
  }
}