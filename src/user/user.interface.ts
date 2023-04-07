export interface IAccountData {
  email: string;
  password: string;
}

export interface IAccountQueryResponse {
  id: string;
  email: string;
  userProfileId: string;
  password?: string;
}

export interface IUserProfileData {
  fullName: string;
  dob: Date | string;
}

export interface IRegisterData {
  email: string;
  password: string;
  dob: Date | string;
  fullName: string;
}

export interface IRegisterResponse {
  id: string;
}

export interface IUserProfileResponse {
  id: string;
  email: string;
  fullname: string;
  refreshToken?: string;
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
}
