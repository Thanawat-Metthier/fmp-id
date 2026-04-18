import { db_writer } from './connection';

async function seed() {
  console.log('🌱 Seeding database...');
  try {
    // Add seed logic here

    console.log('✅ Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
