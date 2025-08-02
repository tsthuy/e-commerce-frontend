export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CategoryListResponse {
  content: CategoryResponse[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type CategoryPaginationParams = Partial<{
  page: number;
  size: number;
  sortBy: string;
  search: string;
  sortDirection: string;
}>;

export type CategoryDetailParams = {
  categoryId: string;
};
