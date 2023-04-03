export interface IAccountData {
  id: string;
  username: string;
  password: string;
}

export interface IUserProfileData {
  id: string;
  email: string;
  fullName: string;
  dob: Date | string;
}

export interface ISignUpData {
  username: string;
  password: string;
  email: string;
  dob: Date | string;
  fullName: string;
}

export interface ISignUpResponse {
  user: IAccountData;
}
