import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';
import { CreateMessageInput } from './dto/send-message.input';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => Message)
  async sendMessage(@Args('data') data: CreateMessageInput) {
    return this.messagesService.create(data.content, data.senderId, data.conversationId);
  }

  @Query(() => [Message])
  async getMessages(@Args('conversationId') conversationId: string) {
    return this.messagesService.findByConversation(conversationId);
  }
}
