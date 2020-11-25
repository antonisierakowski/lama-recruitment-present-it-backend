import { ConnectionInterface } from './ConnectionInterface';
import { inject, injectable } from 'inversify';
import Knex from 'knex';
import { dbModule } from './serviceIdentifiers';

@injectable()
export class DbConnection implements ConnectionInterface {
  constructor(@inject(dbModule.ConnectionInstance) private _connection: Knex) {}

  getConnection(): Knex {
    return this._connection;
  }
}
