import type { StringOrNull } from './common';

export type UserRole = {
  name: string;
  description: StringOrNull;
  permissions: StringOrNull;
};

export type UserAvatar = {
  publicId: string;
  url: string;
};

export type UserAddress = {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
};

export type ProfileApiResponse = {
  code: number;
  result: ProfileResponse;
};

export type ProfileResponse = {
  id: string;
  email: string;
  fullName: string;
  phone: StringOrNull;
  roles: UserRole[];
  avatar: UserAvatar;
  addresses: UserAddress[];
  defaultAddress: UserAddress | null;
};

export type UpdateProfileRequest = {
  fullName?: StringOrNull;
  phone?: StringOrNull;
  avatarUrl?: StringOrNull;
  avatarPublicId?: StringOrNull;
  password: string;
};
