import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';


@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'dev-secret-key', // à mettre dans .env plus tard
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UserResolver, UserService, JwtStrategy],
})
export class UserModule {}
