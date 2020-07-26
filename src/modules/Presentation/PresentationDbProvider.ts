import { PresentationDbProviderInterface } from './PresentationDbProviderInterface';
import { AbstractDbProvider } from '../db/AbstractDbProvider';
import { injectable } from 'inversify';
import { Presentation, PresentationDbRow } from './types';
import { Table } from '../db/types';

@injectable()
export class PresentationDbProvider extends AbstractDbProvider
  implements PresentationDbProviderInterface {
  async insertPresentationEntity(
    presentation: Presentation,
  ): Promise<PresentationDbRow> {
    const query = await this.connection.getConnection();

    const result = await query
      .table(Table.Presentation)
      .insert({
        number_of_slides: presentation.numberOfSlides,
        current_slide: presentation.currentSlide,
        file_name: presentation.fileName,
        file_type: presentation.fileType,
      })
      .returning('*');

    return result[0];
  }
}
