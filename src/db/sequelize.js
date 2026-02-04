require('dotenv').config();
const { Sequelize } = require('sequelize');

const {
  DB_HOST,
  DB_PORT = 5432,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_SCHEMA = 'task_manager',
  DB_SSL = 'false'
} = process.env;

const useSsl = DB_SSL === 'true' || DB_SSL === '1';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  schema: DB_SCHEMA,
  logging: false,
  ...(useSsl && {
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    }
  }),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
