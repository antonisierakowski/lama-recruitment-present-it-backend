export interface PdfServiceInterface {
  getNumberOfSlides(file: Buffer): Promise<number>;

  convertToPdf(file: Buffer): Promise<Buffer>;
}
