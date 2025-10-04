import type { AvatarResponse } from '~/types/profile';

export interface AdminSellerResponse {
  id: string;
  email: string;
  shopName: string;
  phone?: string;
  avatar?: AvatarResponse;
  createdViaOAuth: boolean;
  createdAt: string;
  updatedAt: string;
  availableAmount: number;
  totalOrders: number;
  totalProducts: number;
}

export interface AdminSellerListResponse {
  content: AdminSellerResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface AdminSellerPaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  createdViaOAuth?: boolean;
}
