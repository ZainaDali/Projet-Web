import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../user/user.model';

@ObjectType()
export class Message {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field(() => User)
  sender: User;

  @Field(() => User)
  receiver: User;
}

