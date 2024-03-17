import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(migrationClient);

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: 'src/db/migrations',
    });

    console.log('Migration successful');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
