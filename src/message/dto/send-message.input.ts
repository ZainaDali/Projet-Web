import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SendMessageInput {
  @Field()
  toUserId: string;

  @Field()
  content: string;
  
}
