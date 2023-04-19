interface IResponseBase<T> {
  error?: string;
  message: string;
  data?: T;
}

export { IResponseBase };
