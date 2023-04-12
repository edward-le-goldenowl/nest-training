export interface IAccountPayload {
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

export interface IUserProfilePayload {
  fullName: string;
  dob: Date | string;
}

export interface IRegisterPayload {
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
  avatar: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateUserProfilePayload {
  fullName?: string;
  dob?: Date;
  address?: string;
  phone?: string;
  avatar?: string;
}
