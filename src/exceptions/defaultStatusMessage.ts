import { StatusCode } from '../modules/controllers/StatusCode';

export const defaultStatusMessage = {
  [StatusCode.OK]: 'Ok',
  [StatusCode.BAD_REQUEST]: 'Bad request',
  [StatusCode.FORBIDDEN]: 'Operation is forbidden',
  [StatusCode.RESOURCE_NOT_FOUND]: 'Resource not found',
  [StatusCode.PAYLOAD_TOO_LARGE]: 'Payload too large',
  [StatusCode.UNSUPPORTED_MEDIA_TYPE]: 'Unsupported media type',
  [StatusCode.UNPROCESSABLE_ENTITY]: 'Unprocessable entity',
  [StatusCode.INTERNAL_ERROR]: 'Internal error',
};
