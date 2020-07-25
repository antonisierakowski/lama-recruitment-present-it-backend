import { PresentationFileServiceInterface } from './PresentationFileServiceInterface';
import { injectable } from 'inversify';
import pdfjs from 'pdfjs-dist';

@injectable()
export class PdfService implements PresentationFileServiceInterface {
  async getNumberOfPages(file: Buffer): Promise<number> {
    const document = await pdfjs.getDocument(file).promise;
    return document.numPages;
  }
}
