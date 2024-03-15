import { HttpStatus } from "@nestjs/common";

export class CustomException extends Error {
  errorType: string;
  httpStatus: HttpStatus;
  errorMessage: string;
  constructor(errorMessage: string, httpStatus: HttpStatus, errorType: string) {
    super(errorMessage);
    this.httpStatus = httpStatus;
    this.errorType = errorType;
  }

  getHttpStatus(): HttpStatus {
    return this.httpStatus;
  }

  getErrorType(): string {
    return this.errorType;
  }
}