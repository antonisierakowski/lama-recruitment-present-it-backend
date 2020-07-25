import fs from 'fs';
import { promisify } from 'util';

export const mkDir = promisify(fs.mkdir);
export const writeFile = promisify(fs.writeFile);
export const readFile = promisify(fs.readFile);
export const doesFileExist = promisify(fs.exists);
export const removeFile = promisify(fs.unlink);
