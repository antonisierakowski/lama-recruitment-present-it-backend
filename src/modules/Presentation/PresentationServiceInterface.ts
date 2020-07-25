import { UploadedFile } from 'express-fileupload';

export type UploadedPresentation = {
  presentation: UploadedFile;
};

export interface PresentationServiceInterface {
  uploadPresentation(files: UploadedPresentation): Promise<void>;
}
