import { Module } from '@nestjs/common';
import { ConversationsResolver } from './conversation.resolver';
import { ConversationsService } from './conversations.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ConversationsResolver, ConversationsService, PrismaService],
})
export class ConversationsModule {}
