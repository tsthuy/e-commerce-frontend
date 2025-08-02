import { memo, useMemo, useState } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye, StoreIcon, UserIcon } from 'lucide-react';

import type { AdminOrderListParams, AdminOrderResponse } from '~/types';
import { OrderStatus } from '~/types';

import { useDataTable, useTranslation } from '~/hooks';

import { formatDate, formatPrice } from '~/utils';

import { DataTable, DataTableColumnHeader, DataTableToolbar } from '~/components/common';
import { OrderDetailDialog } from '~/components/pages/seller/order/order-detail-dialog';
import { Badge } from '~/components/ui';

import { useAdminOrderList } from '~/hooks/use-admin-management.hook';

interface AdminOrdersTableProps {
  onViewOrder?: (order: AdminOrderResponse) => void;
  initialFilters?: Partial<AdminOrderListParams>;
}

export const AdminOrdersTable = memo<AdminOrdersTableProps>(({ onViewOrder, initialFilters = {} }) => {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { t } = useTranslation();

  const handleViewOrder = (order: AdminOrderResponse): void => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
    onViewOrder?.(order);
  };

  const handleCloseDialog = (): void => {
    setSelectedOrder(null);
    setIsDialogOpen(false);
  };

  const columns: ColumnDef<AdminOrderResponse>[] = useMemo(
    () => [
      {
        accessorKey: 'orderNumber',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Order.orderNumber')} />,
        cell: ({ row }): JSX.Element => <div className="font-mono text-sm">{row.getValue('orderNumber')}</div>,
        enableSorting: true,
        enableHiding: false
      },
      {
        accessorKey: 'customerName',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Common.customer')} />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          return (
            <div>
              <div className="flex items-center gap-2">
                <UserIcon className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">{order.customerName || 'N/A'}</span>
              </div>
              <div className="text-sm text-muted-foreground">{order.customerEmail || ''}</div>
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'sellerName',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Common.seller')} />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          return (
            <div>
              <div className="flex items-center gap-2">
                <StoreIcon className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">{order.sellerShopName || order.sellerName || 'N/A'}</span>
              </div>
              <div className="text-sm text-muted-foreground">{order.sellerName || ''}</div>
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'total',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Common.total')} />,
        cell: ({ row }): JSX.Element => {
          const amount = row.getValue('total') as number;

          const order = row.original;
          return (
            <div className="flex justify-between gap-2 font-medium text-green-600">
              <p>{formatPrice(amount)}</p>
              <img alt="order" className="h-12 w-12 rounded object-cover" src={order.items[0]?.variantImageUrl || order.items[0]?.productImageUrl} />
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'status',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Order.orderStatus')} />,
        cell: ({ row }): JSX.Element => {
          const status = row.getValue('status') as OrderStatus;
          return (
            <Badge variant={status === OrderStatus.COMPLETED ? 'default' : status === OrderStatus.CANCELLED ? 'destructive' : status === OrderStatus.PENDING ? 'secondary' : 'outline'}>
              {t(`Order.${status.toLowerCase()}`)}
            </Badge>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'paymentMethod',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Order.paymentMethod')} />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          const paymentStatusClassName =
            order.paymentStatus === 'COMPLETED'
              ? 'text-green-600'
              : order.paymentStatus === 'PENDING'
                ? 'text-yellow-600'
                : order.paymentStatus === 'FAILED'
                  ? 'text-red-600'
                  : 'text-muted-foreground';

          return (
            <div>
              <div className="text-sm font-medium">{order.paymentMethod || 'N/A'}</div>
              <div className={`text-xs ${paymentStatusClassName}`}>{order.paymentStatus}</div>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: true
      },
      {
        accessorKey: 'items',
        header: (): JSX.Element => <div>{t('Order.items')}</div>,
        cell: ({ row }): JSX.Element => {
          const items = row.original.items || [];
          return <div className="text-center font-medium">{items.length}</div>;
        },
        enableSorting: false,
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Common.createdAt')} />,
        cell: ({ row }): JSX.Element => {
          const date = row.getValue('createdAt') as string;
          return <div className="text-sm text-muted-foreground">{formatDate(date)}</div>;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        id: 'actions',
        header: (): JSX.Element => <div>{t('Common.actions')}</div>,
        cell: ({ row }): JSX.Element => (
          <div className="flex items-center gap-2">
            <button className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" title={t('Common.viewDetails')} onClick={() => handleViewOrder(row.original)}>
              <Eye className="h-4 w-4" />
            </button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false
      }
    ],
    [t, onViewOrder]
  );

  const filterFields = useMemo(
    () => [
      {
        label: t('Order.searchOrders'),
        value: 'orderNumber' as keyof AdminOrderResponse,
        placeholder: t('Order.searchOrdersPlaceholder')
      }
    ],
    [t]
  );

  const { table } = useDataTable({
    data: [],
    columns,
    pageCount: 0,
    filterFields,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] },
      ...initialFilters
    }
  });

  // Get current table state for API call
  const pagination = table.getState().pagination;
  const sorting = table.getState().sorting;
  const columnFilters = table.getState().columnFilters;

  // Build query parameters from table state
  const queryParams = useMemo((): AdminOrderListParams => {
    const params: AdminOrderListParams = {
      page: pagination.pageIndex,
      size: pagination.pageSize,
      ...initialFilters
    };

    // Handle sorting
    if (sorting.length > 0) {
      const sort = sorting[0];
      params.sortBy = sort.id;
      params.sortDirection = sort.desc ? 'DESC' : 'ASC';
    }

    // Handle search/filtering
    columnFilters.forEach((filter) => {
      const value = filter.value as string;
      if (value) {
        switch (filter.id) {
          case 'orderNumber':
            params.orderNumber = value;
            break;
          case 'customerName':
            params.customerName = value;
            break;
          case 'sellerName':
            params.sellerName = value;
            break;
        }
      }
    });

    return params;
  }, [pagination, sorting, columnFilters, initialFilters]);

  // Fetch data with dynamic parameters
  const { data: ordersResponse, isLoading } = useAdminOrderList({
    data: queryParams
  });

  const orders = ordersResponse?.content || [];
  const pageCount = ordersResponse?.totalPages || 0;

  // Update table options with fetched data
  table.options.data = orders;
  table.options.pageCount = pageCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {t('Order.allOrders')} ({ordersResponse && ordersResponse.totalElements})
          </h2>
        </div>
      </div>
      <DataTable classNameHeader="bg-primary text-primary-foreground hover:bg-primary/80 dark:bg-primary dark:text-primary-foreground" isLoading={isLoading} table={table}>
        <DataTableToolbar filterFields={filterFields} table={table} />
      </DataTable>

      {selectedOrder && <OrderDetailDialog isOpen={isDialogOpen} order={selectedOrder} onClose={handleCloseDialog} />}
    </div>
  );
});

AdminOrdersTable.displayName = 'AdminOrdersTable';
