import { Module } from '@nestjs/common';
import { MessagesResolver } from './message.resolver';
import { MessagesService } from './messages.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConversationsModule } from 'src/conversations/conversation.module';

import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    PrismaModule,
    ConversationsModule,
    BullModule.registerQueue({
      name: 'message-queue',
    }),
  ],
  providers: [MessagesResolver, MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
