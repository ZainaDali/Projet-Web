import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('GraphQL Auth (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  let jwtToken: string;

  it('should register a user', async () => {
    const mutation = `
      mutation {
        register(data: { username: "zaza", password: "1234" }) {
          id
          username
        }
      }
    `;

    const res = await request(httpServer)
      .post('/graphql')
      .send({ query: mutation });

    expect(res.body.data.register.username).toBe('zaza');
  });

  it('should login and return JWT token', async () => {
    const mutation = `
      mutation {
        login(data: { username: "zaza", password: "1234" })
      }
    `;

    const res = await request(httpServer)
      .post('/graphql')
      .send({ query: mutation });

    expect(res.body.data.login).toBeDefined();
    jwtToken = res.body.data.login;
  });

  it('should return the current user with me()', async () => {
    const query = `
      query {
        me {
          id
          username
        }
      }
    `;

    const res = await request(httpServer)
      .post('/graphql')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ query });

    expect(res.body.data.me).toBeDefined();
    expect(res.body.data.me.username).toBe('zaza');
  });
});
