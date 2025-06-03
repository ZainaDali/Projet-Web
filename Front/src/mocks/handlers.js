// src/mocks/handlers.js
import { graphql } from 'msw';

export const handlers = [
  graphql.mutation('Register', (req, res, ctx) => {
    const variables = req?.variables;

    // Vérification simple
    if (!variables || !variables.username || !variables.email || !variables.password) {
      return res(
        ctx.status(400),
        ctx.errors([{ message: 'Champs manquants dans la mutation Register' }])
      );
    }

    const { username, email } = variables;

    return res(
      ctx.data({
        register: {
          token: 'fake-token',
          user: {
            id: '1',
            username,
            email,
          },
        },
      })
    );
  }),

  graphql.mutation('Login', (req, res, ctx) => {
    const variables = req?.variables;

    if (!variables || !variables.email || !variables.password) {
      return res(
        ctx.status(400),
        ctx.errors([{ message: 'Email ou mot de passe manquant' }])
      );
    }

    return res(
      ctx.data({
        login: {
          token: 'fake-token',
          user: {
            id: '1',
            username: 'Zaina',
            email: variables.email,
          },
        },
      })
    );
  }),
];
