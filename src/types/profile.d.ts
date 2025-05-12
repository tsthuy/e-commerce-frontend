import type { StringOrNull } from './common';

export type ProfileResponse = {
  id: string;
  username: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  image: string;
  is_verified_email: boolean;
  verified_email_on: string;
  is_notification_on: boolean;
  is_active: boolean;
  is_staff: boolean;
  address: unknown;
  is_required_change_password: boolean;
  date_of_birth: StringOrNull;
  bio: string;
  is_locked: boolean;
  provider: unknown;
  profile_overview: {
    total_trackers: number;
    total_tracking: number;
  };
};
