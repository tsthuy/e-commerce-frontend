import type { AvatarResponse } from '~/types/profile';

export interface AdminCustomerResponse {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: AvatarResponse;
  createdViaOAuth: boolean;
  createdAt: string;
  updatedAt: string;
  totalOrders: number;
  totalSpent: number;
}

export interface AdminCustomerListResponse {
  content: AdminCustomerResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface AdminCustomerPaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  createdViaOAuth?: boolean;
}
