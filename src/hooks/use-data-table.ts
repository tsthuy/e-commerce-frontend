import { useCallback, useEffect, useMemo, useState } from 'react';

import type { ColumnFiltersState, PaginationState, SortingState, Table, TableOptions, TableState, VisibilityState } from '@tanstack/react-table';
import { getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useHistory, useLocation } from 'react-router-dom';
import { z } from 'zod';

import { TABLE_LIMIT_DEFAULT, TABLE_PAGE_DEFAULT } from '~/constants';

import { useDebounce } from './';

import type { DataTableFilterField } from '~/types/table';

interface UseDataTableProps<TData>
  extends Omit<TableOptions<TData>, 'pageCount' | 'getCoreRowModel' | 'manualFiltering' | 'manualPagination' | 'manualSorting'>,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {
  /**
   * Defines filter fields for the table. Supports both dynamic faceted filters and search filters.
   * - Faceted filters are rendered when `options` are provided for a filter field.
   * - Otherwise, search filters are rendered.
   *
   * The indie filter field `value` represents the corresponding column name in the database table.
   * @default []
   * @type { label: string, value: keyof TData, placeholder?: string, options?: { label: string, value: string, icon?: ComponentType<{ className?: string }> }[] }[]
   * @example
   * ```ts
   *
   * const filterFields = [
   *   { label: "Title", value: "title", placeholder: "Search titles" }
   * ];
   *
   * const filterFields = [
   *   {
   *     label: "Status",
   *     value: "status",
   *     options: [
   *       { label: "Todo", value: "todo" },
   *       { label: "In Progress", value: "in-progress" },
   *       { label: "Done", value: "done" },
   *       { label: "Canceled", value: "canceled" }
   *     ]
   *   }
   * ];
   * ```
   */
  filterFields?: DataTableFilterField<TData>[];

  /**
   * Enable notion like column filters.
   * Advanced filters and column filters cannot be used at the same time.
   * @default false
   * @type boolean
   */
  enableAdvancedFilter?: boolean;

  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: {
      id: Extract<keyof TData, string>;
      desc: boolean;
    }[];
  };
}
interface SearchParams {
  [key: string]: string;
}

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().optional(),
  sort: z.string().optional()
});

export function useDataTable<TData>({ pageCount = -1, filterFields = [], enableAdvancedFilter = false, ...props }: UseDataTableProps<TData>): {
  table: Table<TData>;
} {
  const location = useLocation();
  const { push } = useHistory();
  const pathname: string = location.pathname;
  const searchParams = new URLSearchParams(location.search);

  const searchParamsObject: SearchParams = {};
  searchParams.forEach((value, key) => {
    searchParamsObject[key] = value;
  });
  const search = searchParamsSchema.parse(searchParamsObject);
  const page = search.page ?? props.initialState?.pagination?.pageIndex ?? TABLE_PAGE_DEFAULT;
  const perPage = search.per_page ?? props.initialState?.pagination?.pageSize ?? TABLE_LIMIT_DEFAULT;
  const sort = search.sort ?? `${props.initialState?.sorting?.[0]?.id}.${props.initialState?.sorting?.[0]?.desc ? 'desc' : 'asc'}`;
  const [column, order] = sort?.split('.') ?? [];
  const { searchableColumns, filterableColumns } = useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options)
    };
  }, [filterFields]);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );
  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    return Array.from(searchParams.entries()).reduce<ColumnFiltersState>((filters, [key, value]) => {
      const filterableColumn = filterableColumns.find((column) => column.value === key);
      const searchableColumn = searchableColumns.find((column) => column.value === key);

      if (filterableColumn) {
        filters.push({
          id: key,
          value: value.split('.')
        });
      } else if (searchableColumn) {
        filters.push({
          id: key,
          value: [value]
        });
      }

      return filters;
    }, []);
  }, [filterableColumns, searchableColumns, searchParams]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: perPage
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize
    }),
    [pageIndex, pageSize]
  );

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: column ?? '',
      desc: order === 'desc'
    }
  ]);

  useEffect(() => {
    push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        per_page: pageSize,
        sort: sorting[0]?.id ? `${sorting[0]?.id}.${sorting[0]?.desc ? 'desc' : 'asc'}` : null
      })}`,
      {
        scroll: false
      }
    );
  }, [pageIndex, pageSize, sorting]);

  const debouncedSearchableColumnFilters = JSON.parse(
    useDebounce(
      JSON.stringify(
        columnFilters.filter((filter) => {
          return searchableColumns.find((column) => column.value === filter.id);
        })
      ),
      500
    )
  ) as ColumnFiltersState;

  const filterableColumnFilters = columnFilters.filter((filter) => {
    return filterableColumns.find((column) => column.value === filter.id);
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (enableAdvancedFilter) return;
    if (!mounted) {
      setMounted(true);
      return;
    }
    const newParamsObject = {
      page: 1
    };
    for (const column of debouncedSearchableColumnFilters) {
      if (typeof column.value === 'string') {
        Object.assign(newParamsObject, {
          [column.id]: typeof column.value === 'string' ? column.value : null
        });
      }
    }
    for (const column of filterableColumnFilters) {
      if (typeof column.value === 'object' && Array.isArray(column.value)) {
        Object.assign(newParamsObject, { [column.id]: column.value.join('.') });
      }
    }
    const keys = Array.from(searchParams.keys());
    for (const key of keys) {
      if (
        (searchableColumns.find((column) => column.value === key) && !debouncedSearchableColumnFilters.find((column) => column.id === key)) ||
        (filterableColumns.find((column) => column.value === key) && !filterableColumnFilters.find((column) => column.id === key))
      ) {
        Object.assign(newParamsObject, { [key]: null });
      }
    }
    push(`${pathname}?${createQueryString(newParamsObject)}`);

    table.setPageIndex(0);
  }, [JSON.stringify(debouncedSearchableColumnFilters), JSON.stringify(filterableColumnFilters)]);

  const table = useReactTable({
    ...props,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true
  });

  return { table };
}
