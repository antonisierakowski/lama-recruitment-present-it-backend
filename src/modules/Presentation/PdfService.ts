import { PresentationFileServiceInterface } from './PresentationFileServiceInterface';
import { injectable } from 'inversify';

@injectable()
export class PdfService implements PresentationFileServiceInterface {
  async getNumberOfPages(file: Buffer): Promise<number> {
    return null;
  }
}
