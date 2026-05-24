import { sequelize, Job, Product, CompetitorPrice, Alert, User } from "./models/index.js";

async function counts() {
  try {
    await sequelize.authenticate();
    const jobCount = await Job.count();
    const productCount = await Product.count();
    const cpCount = await CompetitorPrice.count();
    const alertCount = await Alert.count();
    const userCount = await User.count();

    console.log(`jobs: ${jobCount}`);
    console.log(`products: ${productCount}`);
    console.log(`competitor_prices: ${cpCount}`);
    console.log(`alerts: ${alertCount}`);
    console.log(`users: ${userCount}`);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

counts();
