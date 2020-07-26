import { PresentationFileServiceInterface } from './PresentationFileServiceInterface';
import { inject, injectable } from 'inversify';
import xml2js from 'xml2js';
import AdmZip from 'adm-zip';
import { presentationModule } from './serviceIdentifiers';
import { ParsedPresentationXmlFile } from './types';

const mainXmlFileName = 'docProps/app.xml';

@injectable()
export class PptxService implements PresentationFileServiceInterface {
  constructor(
    @inject(presentationModule.XmlParser) private parser: xml2js.Parser,
  ) {}

  async getNumberOfSlides(file: Buffer): Promise<number> {
    const mainXmlFileBuffer = this.getMainXmlEntry(file);
    const presentationData = await this.parseXmlPresentationData(
      mainXmlFileBuffer,
    );
    const numberOfPages = presentationData.Properties.Slides[0];
    return Number(numberOfPages);
  }

  private getMainXmlEntry(pptxFile: Buffer): Buffer {
    const zip = new AdmZip(pptxFile);
    return zip.getEntry(mainXmlFileName).getData();
  }

  private async parseXmlPresentationData(
    xml: Buffer,
  ): Promise<ParsedPresentationXmlFile> {
    return new Promise((resolve, reject) => {
      this.parser.parseString(
        xml,
        (err: Error, result: ParsedPresentationXmlFile) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        },
      );
    });
  }
}
