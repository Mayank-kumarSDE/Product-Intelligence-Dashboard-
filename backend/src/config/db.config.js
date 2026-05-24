import { Sequelize } from "sequelize";
import { env, requireEnv } from "./env.config.js";

requireEnv("DATABASE_URL", env.databaseUrl);

export const sequelize = new Sequelize(env.databaseUrl, {
  dialect: "postgres",
  logging: env.nodeEnv === "development" ? false : false,
  dialectOptions:
    env.nodeEnv === "production"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {}
});
