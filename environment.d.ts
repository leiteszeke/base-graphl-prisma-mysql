type Envs = 'dev' | 'qa' | 'local' | 'production';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: Envs;
      PORT: string;
      TOKEN_SECRET: string;

      DATABASE_URL: string;

      REDIS_HOST: string;
      REDIS_PASS: string;
      REDIS_PORT: string;
    }
  }
}

export {};
