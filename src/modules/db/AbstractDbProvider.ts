import { inject, injectable } from 'inversify';
import { ConnectionInterface } from './ConnectionInterface';
import { dbModule } from './serviceIdentifiers';

@injectable()
export abstract class AbstractDbProvider {
  constructor(
    @inject(dbModule.ConnectionInterface)
    protected connection: ConnectionInterface,
  ) {}
}
