namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: number;
    MONGO_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
  }
}

declare namespace Express {
  export interface Request {
    user: any;
  }
}
