import { UploadedPresentation } from './types';

export interface PresentationServiceInterface {
  uploadPresentation(files: UploadedPresentation): Promise<void>;
}
