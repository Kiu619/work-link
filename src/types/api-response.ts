
export interface ApiResponse<T = unknown> {
  code: string;
  type: string;
  message: string;
  data?: T;
  messageObjects?: unknown[];
  messageFields?: unknown[];
  status?: number;
}
