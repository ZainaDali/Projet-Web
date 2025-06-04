import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/user/user.model';
import { Message } from 'src/messages/message.entity';

@ObjectType()
export class Conversation {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  title?: string | null;


  @Field(() => [User])
  participants: User[];

  @Field(() => [Message])
  messages: Message[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
