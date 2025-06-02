import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';

@ObjectType()
export class Conversation {
  @Field(() => ID)
  id: string;

  @Field(() => [User])
  participants: User[];

  @Field()
  createdAt: string;
}
