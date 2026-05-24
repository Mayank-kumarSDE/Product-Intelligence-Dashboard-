import { env } from "./config/env.config.js";
import { sequelize } from "./db/models/index.js";
import { app } from "./app.js";

await sequelize.authenticate();
await sequelize.sync();

app.listen(env.port, () => {
  console.log(`Quantacus API running on port ${env.port}`);
});
