import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,

    @InjectQueue('message-queue') private messageQueue: Queue
  ) {}

  async create(content: string, senderId: string, conversationId: string) {
    return this.prisma.message.create({
      data: { content, senderId, conversationId },
    });
  }

  async findByConversation(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async enqueueMessage(content: string, senderId: string, conversationId: string) {
    await this.messageQueue.add('new-message', {
      content,
      senderId,
      conversationId,
    });
  }
}
