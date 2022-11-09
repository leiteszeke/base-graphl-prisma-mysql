import { PrismaClient } from '@prisma/client';
import logger from '../helpers/logger';

export const prisma = new PrismaClient();

export const initPrisma = async () => {
  try {
    await prisma
      .$connect()
      .then(() => logger.info('🛢  MySQL connected'))
      .catch((err) => logger.error(`🛢  MySQL connection error`, err));
  } catch (e) {
    logger.error(`🛢  MySQL connection error`, e);
  }
};
