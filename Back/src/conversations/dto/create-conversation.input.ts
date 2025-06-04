import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateConversationInput {
  @Field(() => String, { nullable: true }) // ✅ ICI la correction
  title?: string | null;

  @Field(() => [String])
  participantIds: string[];
}
