import { User } from '@prisma/client';
import { Request } from 'express';
import { Socket } from 'socket.io';

export type Generic<T = unknown> = Record<string, T>;

export type ServerToClientEvents = {
  KEY: (extraData?: Generic) => void;
};

export type ClientToServerEvents = {
  KEY: () => void;
};

export type IOServer = Socket<ClientToServerEvents, ServerToClientEvents>;

export type AppRequest = Request & {
  io: IOServer;
  user: User;
};

export enum ResponseCode {
  Success = 200,
  Created = 201,
  NoAuthorative = 200, // 203,
  NoContent = 200, // 204,
  BadRequest = 400,
  NotAuthorized = 401,
  NotFound = 404,
}

export enum ResponseMessage {
  Success = 'success',
  Updated = 'updated',
  Deleted = 'deleted',
  Error = 'error',
  NotFound = 'not_found',
  BadRequest = 'bad_request',
  InvalidFile = 'invalid_file',
  NotAuthorized = 'not_authorized',
}

export type TrashedFilter = -1 | 0 | 1 | null | undefined;

export type RoundingMethod = {
  floor: number;
  none: number | null;
  ceil: number | null;
};

export type RoundingConfig = {
  rounding: string;
  roundingMethod?: RoundingMethod;
};
