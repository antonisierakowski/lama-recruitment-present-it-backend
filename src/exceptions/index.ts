import { defaultStatusMessage } from './defaultStatusMessage';
import { StatusCode } from '../modules/controllers/StatusCode';

export class HttpException extends Error {
  constructor(public statusCode: StatusCode, message?: string) {
    super(message);
  }
}

const createHttpException = (statusCode: StatusCode) => {
  return class extends HttpException {
    constructor(message: string = defaultStatusMessage[statusCode]) {
      super(statusCode, message);
    }
  };
};

export const UnprocessableEntityException = createHttpException(
  StatusCode.UNPROCESSABLE_ENTITY,
);
export const ResourceNotFoundException = createHttpException(
  StatusCode.RESOURCE_NOT_FOUND,
);
export const ForbiddenException = createHttpException(StatusCode.FORBIDDEN);
export const UnsupportedMediaTypeException = createHttpException(
  StatusCode.UNSUPPORTED_MEDIA_TYPE,
);
export const BadRequestException = createHttpException(StatusCode.BAD_REQUEST);
export const InternalError = createHttpException(StatusCode.INTERNAL_ERROR);
