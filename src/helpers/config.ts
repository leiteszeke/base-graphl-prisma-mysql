/* eslint-disable @typescript-eslint/no-unused-vars */
const parseEmptyString = (value: string | undefined): string => {
  if (!value) {
    return '';
  }

  return value.toString();
};

const parseString = (value: string | undefined): string => {
  return (value ?? '').toString();
};

const parseNumber = (value: string | undefined): number => {
  return Number(value ?? 0);
};

const parseBoolean = (value: string | boolean | undefined): boolean => {
  if (!value) {
    return false;
  }

  if (value === 'true' || value === true) {
    return true;
  }

  return false;
};

const Config = {
  isProduction: parseString(process.env.NODE_ENV) === 'production',
  env: parseString(process.env.NODE_ENV),
  port: parseString(process.env.PORT),
  tokenSecret: parseString(process.env.TOKEN_SECRET),

  // X-Keys
  tasksApiKey: parseString(process.env.TASKS_API_KEY),

  // MySQL
  dbHost: parseString(process.env.DB_HOST),
  dbUser: parseString(process.env.DB_USER),
  dbPass: parseString(process.env.DB_PASS),
  dbBase: parseString(process.env.DB_BASE),
  dbPort: parseNumber(process.env.DB_PORT),

  // Redis
  redisHost: parseString(process.env.REDIS_HOST),
  redisPass: parseEmptyString(process.env.REDIS_PASS),
  redisPort: parseNumber(process.env.REDIS_PORT),

  // Sockets
  wsPort: parseString(process.env.WS_PORT),
  socketEnabled: parseBoolean(process.env.SOCKET_ENABLED),

  // Logtail
  logtailToken: parseString(process.env.LOGTAIL_TOKEN),
};

export default Config;
