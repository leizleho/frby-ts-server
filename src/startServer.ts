import 'reflect-metadata';
import 'dotenv/config';
import { GraphQLServer } from 'graphql-yoga';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as RateLimit from 'express-rate-limit';
import * as RateLimitRedisStore from 'rate-limit-redis';
import { redis } from './redis';
import * as express from 'express';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import { createTypeormConn } from './utils/createTypeormConn';
import { confirmEmail } from './routes/confirmEmail';
import { genSchema } from './utils/genSchema';
import { redisSessionPrefix, offerCacheKey } from './constants';
import { createTestConn } from './testUtils/createTestConn';
import { applyMiddleware } from 'graphql-middleware';
import { middleware } from './middleware';
import { userLoader } from './loaders/UserLoader';
import { Offer } from './entity/Offer';

const SESSION_SECRET = 'ajslkjalksjdfkl';
const RedisStore = connectRedis(session as any);

export const startServer = async () => {
  if (process.env.NODE_ENV === 'test') {
    await redis.flushall();
  }
  const schema = genSchema() as any;
  applyMiddleware(schema, middleware);

  const pubsub = new RedisPubSub(
    process.env.NODE_ENV === 'production'
      ? {
          connection: process.env.REDIS_URL as any
        }
      : {}
  );

  const server = new GraphQLServer({
    schema,
    context: ({ request, response }) => ({
      redis,
      url: request ? request.protocol + '://' + request.get('host') : '',
      session: request ? request.session : undefined,
      req: request,
      res: response,
      userLoader: userLoader(),
      pubsub
    })
  });

  const limiter = RateLimit({
    store: new RateLimitRedisStore({
      client: redis
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  server.express.use(limiter);

  server.express.use(
    session({
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix
      }),
      name: 'qid',
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    } as any)
  );

  server.express.use('/images', express.static('images'));

  const cors = {
    credentials: true,
    origin:
      process.env.NODE_ENV === 'test'
        ? '*'
        : (process.env.FRONTEND_HOST as string)
  };

  server.express.get('/confirm/:id', confirmEmail);

  if (process.env.NODE_ENV === 'test') {
    await createTestConn(true);
  } else {
    const conn = await createTypeormConn();
    await conn.runMigrations();
  }

  // clear cache
  await redis.del(offerCacheKey);
  // fill cache
  const offers = await Offer.find();
  const offerStrings = offers.map(offer => JSON.stringify(offer));
  await redis.lpush(offerCacheKey, ...offerStrings);
  // console.log(await redis.lrange(offerCacheKey, 0, -1));

  const port = process.env.PORT || 4000;
  const app = await server.start({
    cors,
    port: process.env.NODE_ENV === 'test' ? 0 : port
  });
  console.log('Server is running on localhost:4000');

  return app;
};
