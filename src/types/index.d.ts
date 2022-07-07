import { Secret } from "jsonwebtoken";

namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    PORT: number;
    MONGO_URI: string;
    JWT_SECRET: Secret;
    JWT_EXPIRES_IN: string;
  }
}
