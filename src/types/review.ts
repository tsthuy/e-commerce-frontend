export type CreateReviewRequest = {
  productId: string;
  orderId: string;
  content: string;
  rating: number;
};

export type ProductReviewResponse = {
  id: string;
  content: string;
  rating: number;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  productId: string;
  orderId: string;
};

export type ProductReviewListParams = {
  productId: string;
  page?: number;
  size?: number;
};

export type ProductReviewListResponse = {
  content: ProductReviewResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
};
