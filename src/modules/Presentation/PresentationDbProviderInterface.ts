import { Presentation, PresentationDbRow } from './types';

export interface PresentationDbProviderInterface {
  insertPresentationEntity(
    presentation: Presentation,
  ): Promise<PresentationDbRow>;

  getPresentationEntity(id: string): Promise<PresentationDbRow>;

  updatePresentationEntity(presentation: Partial<Presentation>): Promise<void>;

  deletePresentationEntity(id: string): Promise<PresentationDbRow>;
}
