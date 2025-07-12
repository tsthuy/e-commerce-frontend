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

export type GoogleOAuthRequest = {
  idToken: string;
  authenticationType: 'CUSTOMER' | 'SELLER';
  fullName?: string;
  shopName?: string;
  phone?: string;
};

export type GoogleOAuthResponse = {
  code: number;
  result: {
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
    needsProfileSetup: boolean;
    message: string;
  };
};

export type RefreshTokenBody = {
  refreshToken: string;
};
export type RefreshTokenResponse = LoginWithEmailResponse;

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
