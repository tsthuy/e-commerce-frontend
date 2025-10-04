export interface AddToCartRequest {
  productId: string;
  variantId?: string;
  quantity?: number;
  options?: string;
}

export interface UpdateCartItemRequest {
  quantity?: number;
  variantId?: string;
  options?: string;
}

export interface CartItemResponse {
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
  variantId?: string;
  quantity: number;
  price: number;
  subtotal: number;
  selected: boolean;
  options?: string;
  createdAt: string;
  updatedAt: string;

  variantName?: string;
  variantImage?: string;
  variantStock?: number;
  variantAvailable?: boolean;
}

export interface CartResponse {
  id: string;
  customerId: string;
  totalItems: number;
  totalPrice: number;
  items: CartItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
}
