import path from 'path';
import { FileStorageServiceInterface } from './FileStorageServiceInterface';
import { injectable } from 'inversify';
import shortid from 'shortid';
import { ResourceNotFoundException, throwIf } from '../../exceptions';
import * as utils from './utils';
import { Readable } from 'stream';
import { createWriteStream, createReadStream, ReadStream } from 'fs';

@injectable()
export class FileSystemStorageService implements FileStorageServiceInterface {
  private readonly path: string = './__static';

  async saveFile(file: Readable): Promise<string> {
    const fileName = shortid.generate();
    const fullPath = path.join(this.path, fileName);
    if (!(await utils.doesFileExist(this.path))) {
      await utils.mkDir(this.path);
    }
    return new Promise(resolve => {
      const writeStream = createWriteStream(fullPath);
      file.pipe(writeStream);
      writeStream.on('close', () => {
        resolve(fileName);
      });
    });
  }

  async getFile(fileName: string): Promise<ReadStream> {
    const fullPath = path.join(this.path, fileName);
    try {
      return createReadStream(fullPath);
    } catch (error) {
      throw new ResourceNotFoundException();
    }
  }

  async removeFile(fileName: string): Promise<void> {
    const fullPath = path.join(this.path, fileName);
    const doesFileExist = await utils.doesFileExist(this.path);
    throwIf(!doesFileExist, new ResourceNotFoundException());
    await utils.removeFile(fullPath);
  }
}
