export type GetStartedBody = {
  email: string;
};
export type GetStartedResponse = {
  id: string;
  email: string;
  completed_signup: boolean;
  is_verified: boolean;
  is_active: boolean;
  is_staff: boolean;
  use_long_polling: boolean;
  is_allow_reset_password: boolean;
  is_verified_reset_password_email: boolean;
  auth_provider: unknown;
  total_trackers: number;
  total_tracking: number;
};

export type LoginWithEmailBody = {
  id: string;
  password: string;
};
export type LoginWithEmailResponse = {
  token: string;
  refresh: string;
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
