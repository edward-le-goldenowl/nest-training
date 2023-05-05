interface IRequest extends Partial<Request> {
  res: any;
  user?: {
    id: string;
    refreshToken: string;
    accessToken: string;
    email: string;
    usersProfileId: string;
    password?: string;
  };
}

export { IRequest };
