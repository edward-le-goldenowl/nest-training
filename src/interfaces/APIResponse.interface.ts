export interface IResponseBase<T> {
  errorCode?: string;
  message: string;
  data?: T;
}
