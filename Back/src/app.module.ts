import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConversationsModule } from './conversations/conversation.module';
import { MessagesModule } from './messages/message.module';

import { BullModule } from '@nestjs/bull';
import { QueuesModule } from './queues/queues.module';
import { MessageGateway } from './gateways/message.gateway';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PrismaModule,
    UserModule,
    ConversationsModule,
    MessagesModule,
    QueuesModule, 
  ],
  providers: [MessageGateway],
})
export class AppModule {}
