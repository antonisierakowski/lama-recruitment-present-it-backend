import { PresentationDbProviderInterface } from './PresentationDbProviderInterface';
import { AbstractDbProvider } from '../db/AbstractDbProvider';
import { injectable } from 'inversify';
import { Presentation, PresentationDbRow } from './types';
import { Table } from '../db/types';
import { first } from 'lodash';
import { mapPresentationToDbEntity } from './utils';

@injectable()
export class PresentationDbProvider
  extends AbstractDbProvider
  implements PresentationDbProviderInterface {
  async insertPresentationEntity(
    presentation: Presentation,
  ): Promise<PresentationDbRow> {
    const query = await this.connection.getConnection();

    try {
      const result = await query
        .table<PresentationDbRow>(Table.Presentation)
        .insert(mapPresentationToDbEntity(presentation))
        .returning('*');
      return first(result);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async getPresentationEntity(id: string): Promise<PresentationDbRow> {
    const query = await this.connection.getConnection();

    try {
      return await query
        .select<PresentationDbRow>()
        .from(Table.Presentation)
        .where({ id })
        .first();
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async updatePresentationEntity(
    presentation: Partial<Presentation>,
  ): Promise<PresentationDbRow> {
    const query = await this.connection.getConnection();

    try {
      const result = await query
        .table<PresentationDbRow>(Table.Presentation)
        .where({ id: presentation.id })
        .update(mapPresentationToDbEntity(presentation as Presentation))
        .returning('*');

      return first(result);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async deletePresentationEntity(id: string): Promise<PresentationDbRow> {
    const query = await this.connection.getConnection();

    const result = await query
      .table<PresentationDbRow>(Table.Presentation)
      .where({ id })
      .delete()
      .returning('*');
    return first(result);
  }
}
