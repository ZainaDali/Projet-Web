import { Resolver, Query, ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class PingResponse {
  @Field()
  result: string;
}

@Resolver(() => PingResponse)
export class PingResolver {
  @Query(() => PingResponse)
  ping(): PingResponse {
    return { result: 'pong' };
  }
}
