/**
 * Run the SQL migration file against PostgreSQL.
 * Requires DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME in .env.
 * Usage: npm run db:migrate
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function run() {
  const {
    DB_HOST,
    DB_PORT = 5432,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_SSL = 'false'
  } = process.env;

  if (!DB_HOST || !DB_USER || !DB_NAME) {
    console.error('Missing required env: DB_HOST, DB_USER, DB_NAME (DB_PASSWORD can be empty)');
    process.exit(1);
  }

  const sqlPath = path.join(__dirname, '..', 'migrations', '001_create_tasks.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const useSsl = DB_SSL === 'true' || DB_SSL === '1';
  const client = new Client({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    ...(useSsl && { ssl: { rejectUnauthorized: false } })
  });

  try {
    await client.connect();
    await client.query(sql);
    console.log('Migration 001_create_tasks.sql completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
