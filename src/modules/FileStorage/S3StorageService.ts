import { FileStorageServiceInterface } from './FileStorageServiceInterface';
import { Readable } from 'stream';
import { ReadStream } from 'fs';
import { injectable } from 'inversify';
import S3 from 'aws-sdk/clients/s3';

@injectable()
export class S3StorageService implements FileStorageServiceInterface {
  private _s3: S3;
  private _bucketName: string = process.env.S3_BUCKET_NAME;

  constructor() {
    this._s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ACCESS_SECRET,
    });
  }

  saveFile(file: Readable, fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._s3.upload(
        {
          Body: file,
          Bucket: this._bucketName,
          Key: fileName,
        },
        err => {
          if (err) reject(err);
          resolve();
        },
      );
    });
  }

  getFile(fileName: string): ReadStream {
    return this._s3
      .getObject({
        Bucket: this._bucketName,
        Key: fileName,
      })
      .createReadStream() as ReadStream;
  }

  removeFile(fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._s3.deleteObject(
        {
          Bucket: this._bucketName,
          Key: fileName,
        },
        err => {
          if (err) reject(err);
          resolve();
        },
      );
    });
  }
}
