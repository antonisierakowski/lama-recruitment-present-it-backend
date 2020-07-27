import Knex from 'knex';

const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB } = process.env;

export const dbConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB,
  },
};
