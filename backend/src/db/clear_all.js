import { sequelize } from "./models/index.js";

async function clearAll() {
  await sequelize.authenticate();
  const queryInterface = sequelize.getQueryInterface();

  // Order matters due to foreign keys: disable, truncate, enable
  try {
    await sequelize.transaction(async (t) => {
      // Disable triggers and constraints for Postgres
      await sequelize.query('SET session_replication_role = replica;', { transaction: t });

      // Truncate known tables
      const tables = [
        'competitor_prices',
        'alerts',
        'products',
        'jobs',
        'users'
      ];

      for (const table of tables) {
        await sequelize.query(`TRUNCATE TABLE \"${table}\" RESTART IDENTITY CASCADE;`, { transaction: t });
        console.log(`Truncated ${table}`);
      }

      // Re-enable
      await sequelize.query('SET session_replication_role = DEFAULT;', { transaction: t });
    });

    console.log('All specified tables truncated successfully.');
  } catch (err) {
    console.error('Failed to clear tables:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('clear_all.js')) {
  clearAll();
}

export default clearAll;
