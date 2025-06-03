import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HealthController } from './health/health.controller';

import { BullModule } from '@nestjs/bull';
import { MessageProcessor } from './message/message.processor';

import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    // Connexion à Redis
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    // Déclaration de la queue "message"
    BullModule.registerQueue({
      name: 'message',
    }),
  ],
  controllers: [
    AppController,
    AppService,
    HealthController, // Ton contrôleur "OK" + "job"
  ],
  providers: [
    AppService,
    MessageProcessor, // Ton consumer de la queue
  ],
})
export class AppModule {}
