import { PrismaClient } from '@prisma/client';
import logger from '../helpers/logger';

export const prisma = new PrismaClient();

export const initPrisma = async () => {
  try {
    logger.info('🛢 MySQL connecting...');

    /*
    prisma.$use(async (params, next) => {
      return next(params);
    });
    */

    await prisma
      .$connect()
      .then(() => logger.info('🛢 MySQL connected'))
      .catch((err) =>
        logger.error(`🛢 MySQL connection error`, {
          error: err,
        })
      );
  } catch (e) {
    logger.error(`🛢 MySQL connection error`, {
      error: e,
    });
  }
};
