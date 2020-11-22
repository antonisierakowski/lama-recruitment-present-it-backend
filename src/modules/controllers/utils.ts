import { Response } from 'express';
import { HttpException } from '../../exceptions';
import { StatusCode } from './StatusCode';
import { defaultStatusMessage } from '../../exceptions/defaultStatusMessage';

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
  console.log(error);
  if (error instanceof HttpException) {
    sendResponse(res, error.statusCode, error.message);
  } else {
    sendResponse(
      res,
      StatusCode.INTERNAL_ERROR,
      defaultStatusMessage[StatusCode.INTERNAL_ERROR],
    );
  }
};

export const PRESENTATION_OWNER_COOKIE_VAL = 'PRES_OWNER';
export const PRESENTATION_OWNER_COOKIE_MAX_AGE = 360000;
