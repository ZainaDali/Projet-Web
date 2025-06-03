import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => User)
  sender: User;

  @Field()
  conversationId: string;

  @Field()
  timestamp: string;
}
