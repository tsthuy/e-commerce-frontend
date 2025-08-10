import { memo, useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { ProductResponse } from '~/types';

import { useDataTable, useProductDelete, useSellerProductList } from '~/hooks';

import { DataTable, DataTableColumnHeader, DataTableToolbar, TasksTableToolbarActions } from '~/components/common/table';
import { Button } from '~/components/ui';

interface ProductsTableProps {
  onEdit?: (product: ProductResponse) => void;
  onView?: (product: ProductResponse) => void;
  onCreate?: () => void;
}

export const ProductsTable = memo<ProductsTableProps>(({ onEdit, onView, onCreate }) => {
  const { t } = useTranslation();
  const deleteMutation = useProductDelete();
  const columns: ColumnDef<ProductResponse>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input checked={table.getIsAllPageRowsSelected()} className="rounded border border-gray-300" type="checkbox" onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <input checked={row.getIsSelected()} className="rounded border border-gray-300" type="checkbox" onChange={(e) => row.toggleSelected(e.target.checked)} />
            <img alt={row.getValue('name')} className="h-14 w-14 rounded-md object-cover" src={row.original.defaultImageUrl} />
          </div>
        ),
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('Seller.productName')} />,
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.getValue('name')}</div>
            {row.original.sku && <div className="text-sm text-muted-foreground">SKU: {row.original.sku}</div>}
          </div>
        ),
        enableSorting: true,
        enableHiding: false
      },
      {
        accessorKey: 'categoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('Seller.category')} />,
        cell: ({ row }) => <div className="text-sm">{row.getValue('categoryName') || '-'}</div>,
        enableSorting: false,
        enableHiding: true
      },
      {
        accessorKey: 'price',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('Seller.price')} />,
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('Seller.stockQuantity')} />,
        cell: ({ row }): JSX.Element => {
          const stock = row.getValue('stock') as number;
          return <div className={`text-sm ${stock <= 0 ? 'text-red-600' : stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>{stock}</div>;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('Seller.status')} />,
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('Common.createdAt')} />,
        cell: ({ row }): JSX.Element => {
          const date = new Date(row.getValue('createdAt'));
          return <div className="text-sm">{date.toLocaleDateString()}</div>;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        id: 'actions',
        header: t('Seller.actions'),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onView?.(row.original)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEdit?.(row.original)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button className="text-red-600 hover:text-red-700" disabled={deleteMutation.isPending} size="sm" variant="outline" onClick={() => deleteMutation.mutate(row.original.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false
      }
    ],
    [onEdit, onView, deleteMutation, t]
  );
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
  const pagination = table.getState().pagination;
  const sorting = table.getState().sorting;
  const columnFilters = table.getState().columnFilters;
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
  const { data: productsResponse, isLoading } = useSellerProductList({
    data: queryParamsFromTable
  });

  const products = productsResponse?.content || [];
  const pageCount = productsResponse?.totalPages || 0;

  table.options.data = products;
  table.options.pageCount = pageCount;

  const handleBulkDelete = (): void => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);

    selectedIds.forEach((id) => {
      deleteMutation.mutate(id);
    });

    table.resetRowSelection();
  };

  return (
    <DataTable classNameHeader="bg-primary text-primary-foreground hover:bg-primary/80 dark:bg-primary dark:text-primary-foreground" isLoading={isLoading} table={table}>
      <DataTableToolbar filterFields={filterFields} table={table}>
        <TasksTableToolbarActions
          table={table}
          createAction={{
            label: t('Seller.addProduct'),
            action: () => onCreate?.()
          }}
          deleteAction={{
            label: t('Common.delete'),
            action: handleBulkDelete
          }}
        />
      </DataTableToolbar>
    </DataTable>
  );
});

ProductsTable.displayName = 'ProductsTable';
