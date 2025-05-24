export type SignUpBody = {
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
  refresh: string;
};
export type RefreshTokenResponse = LoginResponse;

export type LogoutBody = {
  directUri?: string;
};
