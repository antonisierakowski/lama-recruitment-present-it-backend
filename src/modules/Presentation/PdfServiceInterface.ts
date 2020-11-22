import { Readable } from 'stream';

export interface PdfServiceInterface {
  getNumberOfSlides(pdfReadable: Readable): Promise<number>;

  convertToPdf(readableToConvert: Readable): Readable;
}
