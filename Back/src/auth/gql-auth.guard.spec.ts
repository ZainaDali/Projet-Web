import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlAuthGuard } from './gql-auth.guard';

describe('GqlAuthGuard', () => {
  let guard: GqlAuthGuard;

  beforeEach(() => {
    guard = new GqlAuthGuard();
  });

  it('should return request with user from GraphQL context', () => {
    const mockUser = { id: '1', username: 'zaza' };

    // On simule le GqlExecutionContext
    const gqlContext = {
      getContext: () => ({
        req: {
          user: mockUser,
        },
      }),
    };

    // On crée un faux ExecutionContext
    const executionContext = {} as ExecutionContext;

    // On force GqlExecutionContext.create() à retourner notre contexte simulé
    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(gqlContext as any);

    // On appelle la méthode à tester
    const req = guard.getRequest(executionContext);

    // On vérifie que l'utilisateur est bien dans req
    expect(req.user).toEqual(mockUser);
  });
});
