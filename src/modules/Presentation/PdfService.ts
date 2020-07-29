import { PdfServiceInterface } from './PdfServiceInterface';
import { injectable } from 'inversify';
// @ts-ignore
import tmp from 'temporary';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { UnsupportedMediaTypeException } from '../../exceptions';
import pdfjs from 'pdfjs-dist';

@injectable()
export class PdfService implements PdfServiceInterface {
  async getNumberOfSlides(file: Buffer): Promise<number> {
    const document = await pdfjs.getDocument(file).promise;
    return document.numPages;
  }

  async convertToPdf(fileToConvert: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const file = new tmp.File();
      const outdir = new tmp.Dir();
      file.writeFile(fileToConvert, (error: Error) => {
        if (error) {
          reject(new UnsupportedMediaTypeException());
        }

        const cmd = `soffice --headless --convert-to pdf ${file.path} --outdir ${outdir.path}`;

        exec(cmd, (error: Error) => {
          if (error) {
            reject(error);
          } else {
            fs.readFile(
              path.join(
                outdir.path,
                path.basename(
                  file.path,
                  path.extname(path.basename(file.path)),
                ) + '.pdf',
              ),
              (error: Error, resultFile: Buffer) => {
                if (error) {
                  reject(error);
                }
                resolve(resultFile);
              },
            );
          }
        });
      });
    });
  }
}
