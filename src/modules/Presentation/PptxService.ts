import { PresentationFileServiceInterface } from './PresentationFileServiceInterface';
import { injectable } from 'inversify';

@injectable()
export class PptxService implements PresentationFileServiceInterface {
  async getNumberOfPages(file: Buffer): Promise<number> {
    return null; // todo
  }
}
