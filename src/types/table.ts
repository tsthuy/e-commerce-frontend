import type { ReactNode } from 'react';

import type { ColumnDef } from '@tanstack/react-table';

import type { AnyType } from '~/types/common';

export type ColumnTable<T> = Array<ColumnDef<T>>;

export type OptionTableFilter = {
  label: string;
  value: string;
  withCount?: boolean;
};

export type DataTableFilterField<TData> = {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: OptionTableFilter[];
  autocomplete?: Array<{ value: string; label: ReactNode; disabled?: boolean; originalData?: AnyType }>;
  isHiddenSearch?: boolean;
  isLoading?: boolean;
  keySearch?: string;
};
