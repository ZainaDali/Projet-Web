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

import { PingModule } from './graphql/ping.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    BullModule.forRoot({
      redis: {
        host: 'redis-11095.c280.us-central1-2.gce.redns.redis-cloud.com',
        port: 11095,
      },
    }),
    PrismaModule,
    UserModule,
    ConversationsModule,
    MessagesModule,
    QueuesModule,
    PingModule,
  ],
  providers: [MessageGateway],
})
export class AppModule {}
