export type UserInfoRequest = {
  id: string;
  type: 'customer' | 'seller';
};

export type UserInfoResponse = {
  id: string;
  name: string;
  avatarUrl?: string;
  type: 'customer' | 'seller';
};
