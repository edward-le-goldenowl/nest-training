export interface ILoginData {
  email: string;
  password: string;
}

export interface ILoginResponse {
  id: string;
  userProfileId: string;
  email: string;
  dob: Date | string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}
