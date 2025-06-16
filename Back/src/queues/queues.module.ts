import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MessageProcessor } from './message.processor';
import { MessageGateway } from '../gateways/message.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'message-queue',
    }),
    PrismaModule,
  ],
  providers: [MessageProcessor, MessageGateway],
})
export class QueuesModule {}
