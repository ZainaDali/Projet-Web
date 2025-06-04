import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { SendMessageInput } from './dto/send-message.input';
import { Message } from './message.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  sendMessage(
    @Args('data') data: SendMessageInput,
    @CurrentUser() user: any,
  ) {
    return this.messageService.createMessage(data, user.id); // 👈 ici
  }
  
  @Query(() => [Message])
  @UseGuards(GqlAuthGuard)
  myMessages(@CurrentUser() user: any) {
    return this.messageService.findMessagesByUser(user.id); // 👈 ici aussi
  }


  @Query(() => [Message])
@UseGuards(GqlAuthGuard)
messages() {
  return this.messageService.findAllMessages();
}


@Mutation(() => Boolean)
@UseGuards(GqlAuthGuard)
async deleteMessage(
  @Args('messageId') messageId: string,
  @CurrentUser() user: any,
) {
  await this.messageService.deleteMessage(messageId, user.id);
  return true;
}


}
