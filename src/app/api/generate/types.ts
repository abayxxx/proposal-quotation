export type errorResponse = {
  status: number;
  headers: object;
  requestID: string;
  error: {
    message: string;
    type: string;
    params?: string[];
    code?: string;
  };
  code: string;
  params?: string[];
  type: string;
};
