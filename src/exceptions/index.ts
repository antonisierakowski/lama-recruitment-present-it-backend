import { defaultErrorMsg, StatusCode } from '../controllers/utils';

export class HttpException extends Error {
  constructor(public statusCode: StatusCode, message?: string) {
    super(message);
  }
}

export class ValidationException extends HttpException {
  constructor(message?: string) {
    super(StatusCode.UNPROCESSABLE_ENTITY, message);
    if (!message) {
      this.message = defaultErrorMsg[this.statusCode];
    }
  }
}

export class ResourceNotFoundException extends HttpException {
  constructor(message?: string) {
    super(StatusCode.RESOURCE_NOT_FOUND, message);
    if (!message) {
      this.message = defaultErrorMsg[this.statusCode];
    }
  }
}

export class BadRequestException extends HttpException {
  constructor(message?: string) {
    super(StatusCode.BAD_REQUEST, message);
    if (!message) {
      this.message = defaultErrorMsg[this.statusCode];
    }
  }
}

export class InternalError extends HttpException {
  constructor(message?: string) {
    super(StatusCode.INTERNAL_ERROR, message);
    if (!message) {
      this.message = defaultErrorMsg[this.statusCode];
    }
  }
}
