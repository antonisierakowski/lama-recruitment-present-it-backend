import { Response } from 'express';
import { HttpException } from '../exceptions';

export enum StatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  RESOURCE_NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_ERROR = 500,
}

export const defaultErrorMsg = {
  [StatusCode.OK]: 'Ok',
  [StatusCode.BAD_REQUEST]: 'Bad request',
  [StatusCode.RESOURCE_NOT_FOUND]: 'Resource not found',
  [StatusCode.UNPROCESSABLE_ENTITY]: 'Unprocessable entity',
  [StatusCode.INTERNAL_ERROR]: 'Internal error',
};

interface MessageResponse {
  message: string;
}

interface HttpResponse<TResponse = any> {
  status: StatusCode;
  response?: TResponse | MessageResponse;
}

export const createResponse = <TResponse = any>(
  statusCode: StatusCode,
  responseBody?: TResponse,
): HttpResponse<TResponse> => {
  const baseResponse = {
    status: statusCode,
  };

  if (!responseBody) {
    return baseResponse;
  }

  const response =
    typeof responseBody === 'string' ? { message: responseBody } : responseBody;

  return {
    ...baseResponse,
    response,
  };
};

export const sendResponse = <TResponse = any>(
  res: Response,
  statusCode: StatusCode,
  responseBody?: any,
): void => {
  const parsedResponse = createResponse<TResponse>(statusCode, responseBody);
  res.status(parsedResponse.status).send(parsedResponse);
};

export const handleError = (res: Response, error: Error): void => {
  if (error instanceof HttpException) {
    sendResponse(res, error.statusCode, error.message);
  } else {
    sendResponse(
      res,
      StatusCode.INTERNAL_ERROR,
      defaultErrorMsg[StatusCode.INTERNAL_ERROR],
    );
  }
};
