import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { MessageGateway } from '../gateways/message.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Processor('message-queue')
@Injectable()
export class MessageProcessor {
  constructor(
    private readonly gateway: MessageGateway,
    private readonly prisma: PrismaService
  ) {}

  @Process('new-message')
  async handleNewMessage(job: Job<any>) {
    const message = job.data;

    const saved = await this.prisma.message.create({
      data: {
        content: message.content,
        senderId: message.senderId,
        conversationId: message.conversationId,
      },
    });

    this.gateway.notifyNewMessage(saved);
  }
}
