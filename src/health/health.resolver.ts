import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  @Query(() => String)
  checkGraphql(): string {
    return 'ok';
  }
}
