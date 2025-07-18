export type CustomerSignUpBody = {
  email: string;
  password: string;
  fullName: string;
  avatarUrl: string;
  publicId: string;
};
export type SignupResponse = {
  id: string;
  emailResponse: string;
  fullName: String;
};

export type LoginWithEmailBody = {
  email: string;
  password: string;
};
export type LoginWithEmailResponse = {
  accessToken: string;
  refreshToken: string;
};

export type LoginWithSocialBody = {
  access_token: string;
  provider: 'Google';
};
export type LoginWithSocialResponse = LoginWithEmailResponse;

export type RefreshTokenBody = {
  refreshToken: string;
};
export type RefreshTokenResponse = LoginResponse;

export type LogoutBody = {
  directUri?: string;
};

export type LogoutRequest = {
  token: string;
  refreshToken: string;
};

export type ChangePasswordBody = {
  password: string;
  newPassword: string;
};

export type SellerSignUpBody = {
  email: string;
  password: string;
  shopName: string;
  shopAvatarUrl: string;
  shopAvatarId: string;
  address: string;
  phone: string;
};

export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';
