export type SellerProfileResponse = {
  id: string;
  email: string;
  shopName: string;
  description: string;
  phone: string;
  shopAvatar?: {
    url: string;
    publicId: string;
  };
};

export type UpdateSellerProfileRequest = {
  password: string;
  shopName?: string;
  description?: string;
  phone?: string;
  shopAvatarUrl?: string;
  shopAvatarId?: string;
};
