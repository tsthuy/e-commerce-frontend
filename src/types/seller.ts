export type SellerProfileResponse = {
  id: string;
  email: string;
  shopName: string;
  createdViaOAuth: boolean;
  description: string;
  phone: string;
  shopAvatar?: {
    url: string;
    publicId: string;
  };
  createdAt?: string;
  totalOrders: number;
  availableAmount: number;
  totalProducts: number;
  averageRating?: number;
  reviewCount?: number;
};

export type UpdateSellerProfileRequest = {
  shopName?: string;
  description?: string;
  phone?: string;
  shopAvatarUrl?: string;
  shopAvatarId?: string;
};
