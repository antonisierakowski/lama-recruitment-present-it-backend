import { PdfServiceInterface } from './PdfServiceInterface';
import { injectable } from 'inversify';
import { spawn } from 'child_process';
import { Readable } from 'stream';

@injectable()
export class PdfService implements PdfServiceInterface {
  async getNumberOfSlides(pdfReadable: Readable): Promise<number> {
    const args = [
      '-c',
      "sed -n 's|.*/Count -\\{0,1\\}\\([0-9]\\{1,\\}\\).*|\\1|p' | sort -rn | head -n 1",
    ];
    const cp = spawn('sh', args);
    const { stdin, stdout } = cp;
    pdfReadable.pipe(stdin);
    return new Promise(resolve => {
      stdout.on('data', (data: Buffer) => {
        resolve(+data.toString());
      });
    });
  }

  convertToPdf(readableToConvert: Readable): Readable {
    const unoconv = spawn('unoconv', ['-f', 'pdf', '--stdin', '--stdout']);
    const { stdin, stdout } = unoconv;
    readableToConvert.pipe(stdin);
    return stdout;
  }
}
