export interface AdminProductListParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  name?: string;
  categoryName?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface AdminProductResponse {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  salePrice?: number;
  stock: number;
  categoryId?: string;
  categoryName?: string;
  sellerProfileId: string;
  sellerName?: string;
  shopName?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  isDeleted: boolean;
  published: boolean;
  isNew: boolean;
  averageRating: number;
  reviewCount: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  images?: Array<{
    id: string;
    url: string;
    publicId: string;
    isDefault: boolean;
  }>;
}

export interface AdminProductListResponse {
  content: AdminProductResponse[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
