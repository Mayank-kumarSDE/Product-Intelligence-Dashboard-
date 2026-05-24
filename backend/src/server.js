import { env } from "./config/env.config.js";
import { sequelize } from "./db/models/index.js";
import { app } from "./app.js";

// Database connection with retry logic (Render ke liye important!)
async function connectDatabase(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('✅ PostgreSQL connected successfully');
      return true;
    } catch (error) {
      console.log(`Database connection attempt ${i + 1}/${retries} failed...`);
      if (i === retries - 1) {
        console.error('❌ All database connection attempts failed:', error.message);
        throw error;
      }
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Start server
async function startServer() {
  try {
    // Connect to database with retry
    await connectDatabase();
    
    // Sync database models
    await sequelize.sync();
    console.log('✅ Database synced');
    
    // Start Express server
    app.listen(env.port, '0.0.0.0', () => {  // '0.0.0.0' is important for Render!
      console.log(`🚀 Quantacus API running on port ${env.port}`);
      console.log(`🌍 Environment: ${env.nodeEnv}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown (Render se SIGTERM aata hai)
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await sequelize.close();
  process.exit(0);
});

startServer();