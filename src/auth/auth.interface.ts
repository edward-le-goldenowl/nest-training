export interface ICurrentUserResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IJwtPayload {
  id: string;
  email: string;
}
