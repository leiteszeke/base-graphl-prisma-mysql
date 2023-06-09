import { Request, Response, NextFunction } from 'express';
import logger from '../helpers/logger';
import models from '../models';
import jwt from 'jsonwebtoken';
import gql from 'graphql-tag';
import { User } from '@prisma/client';
import Config from '../helpers/config';

const publicQueries = ['loginUser', 'loginCodeUser', 'createUser'];

const parseQuery = (query: string) => {
  if (!query) {
    return false;
  }

  const parsed = gql`
    ${query}
  `;

  const value =
    // @ts-expect-error bad typing
    parsed?.definitions?.[0].selectionSet?.selections?.[0]?.name?.value;

  return publicQueries.includes(value);
};

const authMiddleware = () => {
  return async function (req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers && req.headers.authorization;
    const apiKey = req.headers && req.headers['x-api-key'];
    const isPublic = parseQuery(req.body.query);

    if (isPublic) {
      return next();
    }

    if (accessToken) {
      try {
        const verified = jwt.verify(
          accessToken.replace('Bearer ', ''),
          Config.tokenSecret
        );

        if (verified) {
          const verifiedUser = verified as User;

          const user = await models.User.findFirst({
            where: {
              id: verifiedUser.id,
              deletedAt: null,
            },
          });

          if (user) {
            req.body = {
              ...req.body,
              user: {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
              },
            };

            return next();
          }
        }
      } catch (error) {
        logger.error('🚪 Access Token Auth Error', { error });
      }
    }

    logger.error(`No user with the provided token has been found.`, {
      accessToken,
      apiKey,
      withAccessToken: !!accessToken,
      withApiKey: !!apiKey,
      headers: req.headers,
      body: req.body,
      query: req.query,
      url: req.url,
    });

    return res.status(401).json({ message: 'Unauthorized' });
  };
};

export default authMiddleware;
