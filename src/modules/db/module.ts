import { Container } from 'inversify';
import Knex from 'knex';
import { ConnectionInterface } from './ConnectionInterface';
import { DbConnection } from './DbConnection';
import { dbConfig } from '../../config/db';
import { dbModule } from './serviceIdentifiers';
import { TriggerListenerInterface } from './TriggerListenerInterface';
import { TriggerListener } from './TriggerListener';

export const connection = Knex(dbConfig);

export const dbModuleLoader = (container: Container) => {
  container
    .bind<ConnectionInterface>(dbModule.ConnectionInterface)
    .to(DbConnection);
  container.bind<Knex>(dbModule.ConnectionInstance).toConstantValue(connection);
  container
    .bind<TriggerListenerInterface>(dbModule.TriggerListener)
    .to(TriggerListener);
};
