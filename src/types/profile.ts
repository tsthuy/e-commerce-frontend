import type { StringOrNull } from './common';

import type { UserRole } from '~/types/auth';

export type UserAvatar = {
  publicId: string;
  url: string;
};

export type UserAddress = {
  id: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  addressType: string;
  isDefault: boolean;
  recipientPhone: string;
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
  availableAddressTypes: string[];
};

export type UpdateProfileRequest = {
  fullName?: StringOrNull;
  phone?: StringOrNull;
  avatarUrl?: StringOrNull;
  avatarPublicId?: StringOrNull;
  password: string;
};

export type CreateAddressRequest = {
  country: string;
  city: string;
  address: string;
  recipientPhone: string;
  zipCode: string;
  addressType: string;
  isDefault: boolean;
};
