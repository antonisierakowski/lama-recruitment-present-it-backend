import { PresentationDbRow, UploadedPresentation } from './types';

export interface PresentationServiceInterface {
  uploadPresentation(files: UploadedPresentation): Promise<PresentationDbRow>;

  getPresentation(presentationId: string): Promise<Buffer>;
}
