import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { ConversationsService } from './conversations.service';
import { Conversation } from './conversation.entity';
import { CreateConversationInput } from './dto/create-conversation.input';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Conversation)
export class ConversationsResolver {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Mutation(() => Conversation)
  async createConversation(
    @Args('data') data: CreateConversationInput
  ): Promise<Conversation> {
    return this.conversationsService.create(data.title ?? null, data.participantIds);
  }

  
  @UseGuards(GqlAuthGuard)
  @Query(() => [Conversation])
  async myConversations(@Context('req') req: any): Promise<Conversation[]> {
    const userId = req.user?.sub;
    return this.conversationsService.findUserConversations(userId);
  }

}
