import { db } from './db';

async function testConnection() {
  try {
    const { rows } = await db.query('SELECT NOW()', []);
    console.log('Database connection successful:', rows[0]);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();
