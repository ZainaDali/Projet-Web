import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  @Mutation(() => User)
  async createUser(
    @Args('username') username: string,
    @Args('password') password: string,
  
  ): Promise<User> {
    return this.prisma.user.create({
      data: { username, password },
    });
  }
}
