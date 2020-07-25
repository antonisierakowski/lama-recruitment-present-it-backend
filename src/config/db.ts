import Knex from 'knex';

const { HOST, USER, PASSWORD, PORT, DB } = process.env;

export const dbConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: HOST,
    port: Number(PORT),
    user: USER,
    password: PASSWORD,
    database: DB,
  },
};
