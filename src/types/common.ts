import type { Dispatch, FunctionComponent, MutableRefObject, SetStateAction, SVGProps } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = any;
export type StringOrNull = string | null;
export type StringOrNumber = string | number;
export type NumberOrNull = number | null;
export type BooleanOrNumber = boolean | number;

export type Base64Type = string | ArrayBuffer | null;

export type RefType<T> = MutableRefObject<T>;
export type SetStateType<T> = Dispatch<SetStateAction<T>>;

export type IconSvgType = FunctionComponent<
  SVGProps<SVGSVGElement> & {
    title?: string;
  }
>;

export type SetStoreType<T> = (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean | undefined) => void;

export type AtLeastOneField<T> = Partial<T> &
  {
    [K in keyof T]: Pick<T, K>;
  }[keyof T];

// Common pagination interface for all pageable responses
export interface PaginationResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Query parameters for pagination
export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
}

// Status options for dropdowns
export interface StatusOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

// Table column configuration
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}
