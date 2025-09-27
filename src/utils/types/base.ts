export interface BaseResponse {
  status_code: number;
  message: string;
}

export interface SuccessResponse<T> extends BaseResponse {
  success: true;
  data: T;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  detail: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
