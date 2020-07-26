import { inject, injectable } from 'inversify';
import { ConnectionInterface } from './ConnectionInterface';
import { dbModule } from './serviceIdentifiers';
import { PostgresError, PostgresErrorCode } from './types';
import { UnprocessableEntityException } from '../../exceptions';

@injectable()
export abstract class AbstractDbProvider {
  constructor(
    @inject(dbModule.ConnectionInterface)
    protected connection: ConnectionInterface,
  ) {}

  protected handleDbError(error: PostgresError) {
    switch (error.code) {
      case PostgresErrorCode.CHECK_VIOLATION: {
        throw new UnprocessableEntityException();
      }
      default: {
        throw error;
      }
    }
  }
}
