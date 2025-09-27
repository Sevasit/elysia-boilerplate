import { SuccessResponse, ErrorResponse } from "./types/base";

export class Response {
  static success<T>(
    statusCode: number,
    message: string,

    data: T
  ): SuccessResponse<T> {
    return {
      status_code: statusCode,
      message,
      success: true,
      data,
    };
  }

  static error(
    statusCode: number,
    message: string,
    detail: string
  ): ErrorResponse {
    return {
      status_code: statusCode,
      message,
      success: false,
      detail,
    };
  }
}
