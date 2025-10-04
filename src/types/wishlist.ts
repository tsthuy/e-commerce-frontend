export interface AddToWishlistRequest {
  productId: string;
}

export interface WishlistItemResponse {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
    defaultImageUrl: string;
    salePrice?: number;
    stock: number;
    category: {
      id: string;
      name: string;
    };
    sellerName: string;
    seller: {
      id: string;
      brandName: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface WishlistResponse {
  id: string;
  customerId: string;
  name: string;
  totalItems: number;
  items: WishlistItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistSummary {
  totalItems: number;
}
