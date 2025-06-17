import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autoriser CORS pour React (localhost:5173)
  app.enableCors({
    origin: 'https://projet-webfront.onrender.com/', // ou ['https://projet-webfront.onrender.com/']
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();

