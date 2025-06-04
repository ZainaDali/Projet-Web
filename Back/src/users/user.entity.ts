import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;
}
