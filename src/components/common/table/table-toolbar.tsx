import type { HTMLAttributes, ReactNode } from 'react';
import { useCallback, useEffect, useMemo } from 'react';

import type { Table } from '@tanstack/react-table';
import { debounce } from 'lodash';
import { useHistory } from 'react-router-dom';

import { cn } from '~/libs';

import { useCustomForm } from '~/hooks';

import { CustomForm, CustomInputSearch, CustomSelectSearch } from '~/components/form';

import { Button } from '../button';

import { DataTableFacetedFilter } from './';

import type { DataTableFilterField } from '~/types/table';

interface DataTableToolbarProps<TData> extends HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
  customFilterSection?: ReactNode;
}

export function DataTableToolbar<TData>({ table, filterFields = [], children, className, customFilterSection, ...props }: DataTableToolbarProps<TData>): React.JSX.Element {
  const { push } = useHistory();

  const isFiltered = table.getState().columnFilters.length > 1;

  const { searchableColumns, filterableColumns, filterSearchableColumns } = useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options && !field.autocomplete),
      filterableColumns: filterFields.filter((field) => field.options),
      filterSearchableColumns: filterFields.filter((field) => field.autocomplete)
    };
  }, [filterFields]);

  const { form } = useCustomForm();

  const updateSearchParams = useCallback(
    debounce((value: string, key: string) => {
      const searchParams = new URLSearchParams(location.search);
      if (value) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
      push({ search: searchParams.toString() });
    }, 500),
    [location.search, history]
  );
  const resetFilterParams = (): void => {
    const searchParams = new URLSearchParams(location.search);

    filterFields
      .map((field) => field.keySearch)
      .filter(Boolean)
      .forEach((key) => {
        searchParams.delete(key as string);
      });

    push({ search: searchParams.toString() });
  };

  const setValueSearchParams = useCallback((key: string): void => {
    const search = new URLSearchParams(location.search).get(key);
    if (search) form.setValue(key, search);
  }, []);

  useEffect(() => {
    filterSearchableColumns.forEach((item) => {
      setValueSearchParams(item.value as string);
    });
  }, []);

  return (
    <div className={cn('flex w-full items-center justify-between space-x-2 overflow-auto py-1', className)} {...props}>
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : '') && (
                <CustomForm key={String(column.value)}>
                  <CustomInputSearch
                    classNameInput="h-8 w-40 lg:w-64"
                    handleOnChange={(event) => table.getColumn(String(column.value))?.setFilterValue(event.target.value)}
                    handleOnClearSearch={() => table.getColumn(String(column.value))?.setFilterValue('')}
                    name="table-search"
                    placeholder={column.placeholder}
                    value={(table.getColumn(String(column.value))?.getFilterValue() as string) ?? ''}
                  />
                </CustomForm>
              )
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : '') && (
                <DataTableFacetedFilter key={String(column.value)} column={table.getColumn(column.value ? String(column.value) : '')} options={column.options ?? []} title={column.label} />
              )
          )}
        {filterSearchableColumns.length > 0 && (
          <CustomForm className="flex gap-2" provider={form}>
            {filterSearchableColumns.map(
              (column, index) =>
                table.getColumn(column.value ? String(column.value) : '') && (
                  <CustomSelectSearch
                    key={index}
                    className="!mb-0"
                    classNameInput="h-8 min-w-[200px]"
                    classNameLabel="text-xs"
                    handleClear={() => table.getColumn(String(column.value))?.setFilterValue(null)}
                    handleOnSearch={(value) => column.keySearch && updateSearchParams(value, column.keySearch)}
                    handleSelected={(event) => table.getColumn(String(column.value))?.setFilterValue(event.value)}
                    isHiddenSearch={column.isHiddenSearch}
                    label={column.label}
                    labelStyle="dynamic"
                    name={String(column.value)}
                    options={column.autocomplete ?? []}
                    placeholder={column.placeholder}
                  />
                )
            )}
          </CustomForm>
        )}
        {customFilterSection}
        {isFiltered && (
          <Button
            className="h-8"
            variant="outline"
            onClick={() => {
              table.resetColumnFilters();
              resetFilterParams();
              form.reset();
            }}
          >
            Reset filters
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
