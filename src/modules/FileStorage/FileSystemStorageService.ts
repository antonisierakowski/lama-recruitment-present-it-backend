import path from 'path';
import { FileStorageServiceInterface } from './FileStorageServiceInterface';
import { injectable } from 'inversify';
import { ResourceNotFoundException, throwIf } from '../../exceptions';
import * as utils from './utils';
import { Readable } from 'stream';
import { createWriteStream, createReadStream, ReadStream } from 'fs';

@injectable()
export class FileSystemStorageService implements FileStorageServiceInterface {
  private readonly _path: string = './__static';

  async saveFile(file: Readable, name: string): Promise<void> {
    const fullPath = path.join(this._path, name);
    if (!(await utils.doesFileExist(this._path))) {
      await utils.mkDir(this._path);
    }
    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(fullPath);
      file.pipe(writeStream);
      writeStream.on('error', err => {
        reject(err);
      });
      writeStream.on('close', () => {
        resolve();
      });
    });
  }

  getFile(fileName: string): ReadStream {
    const fullPath = path.join(this._path, fileName);
    try {
      return createReadStream(fullPath);
    } catch (error) {
      throw new ResourceNotFoundException();
    }
  }

  async removeFile(fileName: string): Promise<void> {
    const fullPath = path.join(this._path, fileName);
    const doesFileExist = await utils.doesFileExist(this._path);
    throwIf(!doesFileExist, new ResourceNotFoundException());
    await utils.removeFile(fullPath);
  }
}
