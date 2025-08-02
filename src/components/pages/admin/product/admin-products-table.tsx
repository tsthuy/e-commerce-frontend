import { memo, useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import type { ProductResponse } from '~/types';

import { useAdminProductList, useDataTable } from '~/hooks';

import { DataTable, DataTableColumnHeader, DataTableToolbar } from '~/components/common/table';
import { Button } from '~/components/ui';

interface AdminProductsTableProps {
  onView?: (product: ProductResponse) => void;
}

export const AdminProductsTable = memo<AdminProductsTableProps>(({ onView }) => {
  // Define table columns - removed edit and delete actions for admin
  const columns: ColumnDef<ProductResponse>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Product Name" />,
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="">
              <img alt={row.getValue('name')} className="h-14 min-w-14 rounded-md border object-cover" src={row.original.defaultImageUrl} />
            </div>
            <div className="">
              <div className="font-medium">{row.getValue('name')}</div>
              {row.original.sku && <div className="text-sm text-muted-foreground">SKU: {row.original.sku}</div>}
            </div>
          </div>
        ),
        enableSorting: true,
        enableHiding: false
      },
      {
        accessorKey: 'categoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
        cell: ({ row }) => <div className="text-sm">{row.getValue('categoryName') || '-'}</div>,
        enableSorting: false,
        enableHiding: true
      },
      {
        accessorKey: 'seller',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Seller" />,
        cell: ({ row }) => (
          <div className="text-sm">
            <div className="font-medium">{row.original.sellerName || 'N/A'}</div>
          </div>
        ),
        enableSorting: false,
        enableHiding: true
      },
      {
        accessorKey: 'price',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
        cell: ({ row }): JSX.Element => {
          const price = row.getValue('price') as number;
          const salePrice = row.original.salePrice;
          return (
            <div className="text-sm">
              {salePrice ? (
                <>
                  <span className="font-medium text-red-600">${salePrice}</span>
                  <span className="ml-1 text-gray-500 line-through">${price}</span>
                </>
              ) : (
                <span className="font-medium">${price}</span>
              )}
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'stock',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
        cell: ({ row }): JSX.Element => {
          const stock = row.getValue('stock') as number;
          return <div className={`text-sm ${stock <= 0 ? 'text-red-600' : stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>{stock}</div>;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }): JSX.Element => {
          const status = row.getValue('status') as string;
          const isPublished = row.original.isPublished;
          return (
            <div className="flex flex-col">
              <span
                className={`w-fit rounded-full px-2 py-1 text-xs ${
                  status === 'ACTIVE' ? 'bg-green-100 text-green-800' : status === 'INACTIVE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {status}
              </span>
              {isPublished && <span className="mt-1 text-xs text-blue-600">Published</span>}
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
        cell: ({ row }): JSX.Element => {
          const date = new Date(row.getValue('createdAt'));
          return <div className="text-sm">{date.toLocaleDateString()}</div>;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onView?.(row.original)}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false
      }
    ],
    [onView]
  );

  // Filter fields for search and filtering
  const filterFields = useMemo(
    () => [
      {
        label: 'Search products',
        value: 'name' as keyof ProductResponse,
        placeholder: 'Search by name or SKU...'
      }
    ],
    []
  );

  // Initialize table with empty data first to get state
  const { table } = useDataTable({
    data: [],
    columns,
    pageCount: 0,
    filterFields,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] }
    }
  });

  // Get current table state for API call
  const pagination = table.getState().pagination;
  const sorting = table.getState().sorting;
  const columnFilters = table.getState().columnFilters;

  // Build query parameters from table state
  const queryParamsFromTable = useMemo(() => {
    const searchFilter = columnFilters.find((filter) => filter.id === 'name');
    const sortConfig = sorting[0];

    const params: Record<string, string | number> = {
      page: pagination.pageIndex,
      size: pagination.pageSize
    };

    if (sortConfig) {
      params.sortBy = sortConfig.id;
      params.sortDirection = sortConfig.desc ? 'desc' : 'asc';
    }

    if (searchFilter?.value) {
      params.search = String(searchFilter.value);
    }

    return params;
  }, [pagination, sorting, columnFilters]);

  // Fetch data with dynamic parameters using admin hook
  const { data: productsResponse, isLoading } = useAdminProductList({
    data: queryParamsFromTable
  });

  const products = productsResponse?.content || [];
  const pageCount = productsResponse?.totalPages || 0;

  table.options.data = products;
  table.options.pageCount = pageCount;

  return (
    <DataTable classNameHeader="bg-primary text-primary-foreground hover:bg-primary/80 dark:bg-primary dark:text-primary-foreground" isLoading={isLoading} table={table}>
      <DataTableToolbar filterFields={filterFields} table={table} />
    </DataTable>
  );
});

AdminProductsTable.displayName = 'AdminProductsTable';
