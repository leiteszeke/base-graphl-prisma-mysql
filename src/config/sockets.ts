import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from '../helpers/logger';
import Config from '../helpers/config';

export default async function initSockets() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      methods: ['GET', 'POST'],
      origin: [
        // LocalEnvs
        !Config.isProduction && 'http://localhost:3000',
        !Config.isProduction && 'http://localhost:19006',
        // Production

        // QA
      ],
    },
  });

  io.on('connection', (socket) => {
    const socketData = {
      socketId: socket.id,
      appVersion: socket.handshake.auth.appVersion,
      userId: socket.handshake.auth.userId,
      referrer: socket.handshake.auth.referrer,
      roomId: socket.handshake.auth.userId
        ? `Room#${socket.handshake.auth.userId}`
        : null,
    };

    let connectedMsg = '🔌 Socket connected';

    if (socketData.roomId) {
      connectedMsg += ` and joined to room ${socketData.roomId}`;
      socket.join(socketData.roomId);
    }

    logger.debug(connectedMsg, {
      socketData,
    });

    socket.on('disconnect', () => {
      let disconnectedMsg = '✂️  Socket disconnected';

      if (socketData.roomId) {
        disconnectedMsg += ` and removed from room ${socketData.roomId}`;
        socket.leave(socketData.roomId);
      }

      logger.debug(disconnectedMsg, { socketData });
    });
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: Config.wsPort }, resolve)
  );

  logger.info(`🔌 Socket server ready at ws://localhost:${Config.wsPort}`);

  return io;
}
