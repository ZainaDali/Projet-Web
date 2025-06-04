import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput } from './dto/login.input';
import { User } from './user.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Context } from '@nestjs/graphql';
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  register(@Args('data') data: CreateUserInput) {
    return this.userService.register(data);
  }

  @Mutation(() => String)
  login(@Args('data') data: LoginInput) {
    return this.userService.login(data);
  }

  // ✅ Ajout d'une query minimale pour éviter l'erreur
  @Query(() => String)
  hello(): string {
    return 'Hello from GraphQL';
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@Context('req') req: any) {
    return this.userService.findById(req.user?.sub); // ❌ si sub est undefined
  }



  @Query(() => [User])
findAll() {
  return this.userService.findAll();
}

  
  
}


