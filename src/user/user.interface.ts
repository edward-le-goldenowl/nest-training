export interface IAccountData {
  email: string;
  password: string;
  role: string;
}

export interface IAccountQueryResponse {
  id: string;
  email: string;
  role: string;
  userProfileId: string;
  password?: string;
  refreshToken: string | null;
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
  role: string;
}

export interface IRegisterResponse {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfileResponse {
  id: string;
  email: string;
  fullname: string;
  dob: Date;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
