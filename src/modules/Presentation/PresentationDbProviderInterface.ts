import { Presentation, PresentationDbRow } from './types';

export interface PresentationDbProviderInterface {
  insertPresentationEntity(
    presentation: Presentation,
  ): Promise<PresentationDbRow>;
}
