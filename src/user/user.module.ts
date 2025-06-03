import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'dev-secret-key', // à mettre dans .env plus tard
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UserResolver, UserService],
})
export class UserModule {}
