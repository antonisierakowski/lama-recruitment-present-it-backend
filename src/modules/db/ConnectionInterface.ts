import Knex from 'knex';

export interface ConnectionInterface {
  getConnection(): Knex;
}
