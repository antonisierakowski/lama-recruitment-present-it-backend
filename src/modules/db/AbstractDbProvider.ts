import { inject, injectable } from 'inversify';
import { ConnectionInterface } from './ConnectionInterface';
import { dbModule } from './serviceIdentifiers';
import { PostgresError, PostgresErrorCode, PostgresRoutine } from './types';
import {
  BadRequestException,
  UnprocessableEntityException,
  ResourceNotFoundException,
} from '../../exceptions';

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
      case PostgresErrorCode.INVALID_REPRESENTATION: {
        if (error.routine === PostgresRoutine.STRING_TO_UUID) {
          throw new ResourceNotFoundException();
        }
        throw new BadRequestException();
      }
      default: {
        throw error;
      }
    }
  }
}
