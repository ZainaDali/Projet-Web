import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput } from './dto/login.input';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(data: CreateUserInput) {
    const existing = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
  
    if (existing) {
      throw new Error('Username already taken');
    }
  
    const hash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        username: data.username,
        password: hash,
      },
    });
  }
  

  async login(data: LoginInput): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid password');

    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }


  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });
  }
  
}
