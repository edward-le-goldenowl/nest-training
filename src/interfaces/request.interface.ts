interface IRequest extends Partial<Request> {
  res: any;
  user?: {
    id: string;
    refreshToken: string;
    accessToken: string;
    email: string;
    userProfileId: string;
    password?: string;
  };
}

export { IRequest };
