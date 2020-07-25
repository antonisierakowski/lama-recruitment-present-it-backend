import { ConnectionInterface } from './ConnectionInterface';
import { inject, injectable } from 'inversify';
import Knex from 'knex';
import { dbModule } from './serviceIdentifiers';

@injectable()
export class DbConnection implements ConnectionInterface {
  constructor(@inject(dbModule.ConnectionInstance) private connection: Knex) {}

  getConnection(): Knex {
    return this.connection;
  }
}
