import { StatusCode } from '../StatusCode';

export const defaultErrorMsg = {
  [StatusCode.OK]: 'Ok',
  [StatusCode.BAD_REQUEST]: 'Bad request',
  [StatusCode.RESOURCE_NOT_FOUND]: 'Resource not found',
  [StatusCode.UNSUPPORTED_MEDIA_TYPE]: 'Unsupported media type',
  [StatusCode.UNPROCESSABLE_ENTITY]: 'Unprocessable entity',
  [StatusCode.INTERNAL_ERROR]: 'Internal error',
};
