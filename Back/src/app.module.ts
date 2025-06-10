import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HealthController } from './health/health.controller';
import { HealthResolver } from './health/health.resolver';

import { BullModule } from '@nestjs/bull';
import { MessageProcessor } from './message/message.processor';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'; 
import { join } from 'path';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'message',
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, 
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [
    AppController,
    HealthController,
  ],
  providers: [
    AppService,
    HealthResolver,
    MessageProcessor,
  ],
})
export class AppModule {}
