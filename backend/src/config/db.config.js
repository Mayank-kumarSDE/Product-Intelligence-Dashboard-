import { Sequelize } from "sequelize";
import { env } from "./env.config.js";

if (!env.databaseUrl) {
  throw new Error("DATABASE_URL is missing. Check Render environment variables.");
}

export const sequelize = new Sequelize(env.databaseUrl, {
  dialect: "postgres",
  logging: false, 
  dialectOptions: {
    ssl: env.nodeEnv === "production" ? {
      require: true,
      rejectUnauthorized: false 
    } : false
  },
  pool: {
    max: 5, 
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
