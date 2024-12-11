export type RequestError = {
  message: string;
  statusCode: number;
};

export type Request<T> = T extends void
  ? { success: true } | { success: false; error: RequestError }
  : { success: true; data: T } | { success: false; error: RequestError };
