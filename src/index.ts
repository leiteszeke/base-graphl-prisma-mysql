// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import 'reflect-metadata';
import express from 'express';
import http from 'http';
import helmet from 'helmet';
import getSchema from './schemas';
import { initPrisma } from './config/database';
import { GraphQLError } from 'graphql';
import { CustomApolloServer } from './lib/apollo/customServer';
import { Context } from './resolvers/context';
import authMiddleware from './middlewares/auth';
import logger from './helpers/logger';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import Tasks from './tasks';
import initSockets from './config/sockets';
import { Server } from 'socket.io';
import Config from './helpers/config';

async function startApolloServer(io?: Server) {
  const app = express();
  app.use(express.json());

  app.use(
    cors({
      exposedHeaders: ['Content-Filename'],
    })
  );

  app.use(
    fileUpload({
      createParentPath: true,
    })
  );

  // Routes outside authMiddleware
  app.get('/', (_, res) => res.json({ status: 'ok' }));
  app.get('/health', (_, res) => res.json({ status: 'ok' }));

  app.post('/tasks', async (req, res) => {
    if (req.headers['tasks-api-key'] !== Config.tasksApiKey) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const taskName = req.body.taskId;
    const payload = req.body.payload;

    if (!Tasks[taskName]) {
      logger.error(`Task ${taskName} not found`);

      return res.status(400);
    }

    logger.info('Running task', { taskName });

    await Tasks[taskName](payload);

    res.json({ data: [] });
  });

  app.use(authMiddleware());

  app.use(
    helmet({
      crossOriginEmbedderPolicy: Config.isProduction,
      contentSecurityPolicy: Config.isProduction ? undefined : false,
    })
  );
  const httpServer = http.createServer(app);

  await initPrisma();

  const schema = await getSchema();

  const server = new CustomApolloServer({
    persistedQueries: false,
    schema,
    context: async ({ req }) => {
      return {
        user: req.body.user,
        io,
        graphQL: {
          query: req.body.query,
          variables: req.body.variables,
        },
      };
    },
    formatError: (err: GraphQLError, context: Context) => {
      const warnCodes = ['NOT_ALLOWED', 'USER_NOT_FOUND'];
      const input = {
        errorMessage: err.message,
        code: err.extensions.code,
        input: context.graphQL,
      };

      if (warnCodes.includes(err.extensions.code as string)) {
        logger.warn(`☸️ GraphQL ${err.extensions.code} warning`, input);
      } else {
        logger.error(`☸️ GraphQL ${err.extensions.code} error`, input);
      }

      return {
        message: err.message,
        code: err.extensions.code,
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: Config.port }, resolve)
  );

  logger.info(
    `🚀 Server ready at http://localhost:${Config.port}${server.graphqlPath}`
  );
}

const init = async () => {
  if (Config.socketEnabled) {
    const io = await initSockets();

    startApolloServer(io);
  } else {
    startApolloServer();
  }
};

init();
