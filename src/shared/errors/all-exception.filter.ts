import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Response } from 'express';
import { ConfigService } from "@nestjs/config";
import { QueryFailedError } from "typeorm";
import { CustomException } from "./custom-error.exception";

type ErrorResponse = {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  errorType?: string;
}

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private configService: ConfigService
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const { message, httpErrorCode, errorType } = this.handler(exception);
    const errorResponse: ErrorResponse = {
      statusCode: httpErrorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      errorType
    };
    response.status(httpErrorCode).json(errorResponse || {});
    Logger.error(errorResponse);
  }

  private handler(exception: unknown): { message: string, httpErrorCode: number, errorType?: string } {
    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';
    if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      return { message, httpErrorCode: status };
    }
    if (exception instanceof CustomException) {
      status = exception.getHttpStatus();
      message = exception.message;
      return { message, httpErrorCode: status, errorType: exception.getErrorType()};
    }
    return { message, httpErrorCode: status };
  }
}
