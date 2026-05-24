import { sequelize } from "./models/index.js";

await sequelize.authenticate();
await sequelize.sync({ alter: true });
console.log("Database synced");
await sequelize.close();
