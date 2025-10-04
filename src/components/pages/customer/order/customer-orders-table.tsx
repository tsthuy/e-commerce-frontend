import { memo, useMemo, useState } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import type { AnyType } from '~/types';

import { useDataTable, useTranslation } from '~/hooks';

import { formatDate, formatPrice } from '~/utils';

import { DataTable, DataTableColumnHeader, DataTableToolbar, TasksTableToolbarActions } from '~/components/common';
import { Badge, Button } from '~/components/ui';

import type { OrderResponse } from '../../../../types';
import { OrderStatus } from '../../../../types';

import { CustomerOrderDetailDialog } from './customer-order-detail-dialog';

import { useCustomerOrders } from '~/hooks/use-order.hook';
import type { PaginationParams } from '~/types/common';

interface CustomerOrdersTableProps {
  onViewOrder?: (order: OrderResponse) => void;
  initialFilters?: Partial<PaginationParams & { status?: OrderStatus }>;
}

export const CustomerOrdersTable = memo<CustomerOrdersTableProps>(({ onViewOrder, initialFilters = {} }) => {
  const { t } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: OrderStatus): JSX.Element => {
    const statusConfig = {
      [OrderStatus.PENDING]: { label: t('Order.processing'), color: 'warning' },
      [OrderStatus.CONFIRMED]: { label: t('Order.confirmed'), color: 'info' },
      [OrderStatus.PROCESSING]: { label: t('Order.processing'), color: 'info' },
      [OrderStatus.SHIPPED]: { label: t('Order.shipped'), color: 'primary' },
      [OrderStatus.DELIVERED]: { label: t('Order.delivered'), color: 'success' },
      [OrderStatus.COMPLETED]: { label: t('Order.completed'), color: 'success' },
      [OrderStatus.CANCELLED]: { label: t('Order.cancelled'), color: 'danger' },
      [OrderStatus.REFUNDED]: { label: t('Order.refunded'), color: 'warning' }
    };

    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Badge color={config.color as AnyType}>{config.label}</Badge>;
  };

  const columns: ColumnDef<OrderResponse>[] = useMemo(
    () => [
      {
        accessorKey: 'orderNumber',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Order.orderNumber')} />,
        cell: ({ row }): JSX.Element => <div className="font-mono text-sm">{row.getValue('orderNumber')}</div>,
        enableSorting: true,
        enableHiding: false
      },
      {
        accessorKey: 'sellerShopName',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Order.images')} />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          return (
            <div className="flex items-center justify-center text-center">
              <img alt="order" className="h-12 w-12 object-cover" src={order.items[0]?.variantImageUrl || order.items[0]?.productImageUrl} />
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'total',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Order.totalAmount')} />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          return <div className="text-center font-medium">{formatPrice(order.total)}</div>;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'status',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Order.status')} />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          return getStatusBadge(order.status);
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'items',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Order.quantity')} />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          const totalQty = order.items?.reduce((sum: number, item) => sum + item.quantity, 0) || 0;
          return (
            <div className="flex items-center justify-center gap-2 text-center">
              <Badge className="font-mono" variant="outline">
                {totalQty}
              </Badge>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: true
      },
      {
        accessorKey: 'paymentMethod',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Order.paymentMethod')} />,
        cell: ({ row }): JSX.Element => {
          const paymentMethod = row.getValue('paymentMethod') as string;
          const paymentConfig = {
            CASH_ON_DELIVERY: { label: 'COD', color: 'warning' },
            CREDIT_CARD: { label: t('Order.paymentMethods.CREDIT_CARD'), color: 'primary' },
            BANK_TRANSFER: { label: t('Order.paymentMethods.bankTransfer'), color: 'info' },
            E_WALLET: { label: t('Order.paymentMethods.eWallet'), color: 'success' }
          };

          const config = paymentConfig[paymentMethod as keyof typeof paymentConfig] || { label: paymentMethod, color: 'default' };

          return (
            <Badge color={config.color as AnyType} variant="outline">
              {config.label}
            </Badge>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Order.orderDate')} />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          return (
            <div className="text-sm">
              <Badge className="border-yellow-300 bg-yellow-100 text-yellow-800" variant="outline">
                {formatDate(order.createdAt, 'DD/MM/YYYY HH:mm')}
              </Badge>
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        id: 'actions',
        header: t('Order.actions'),
        cell: ({ row }): JSX.Element => (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedOrder(row.original);
                setIsDialogOpen(true);
                onViewOrder?.(row.original);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false
      }
    ],
    [onViewOrder]
  );
  const filterFields = useMemo(
    () => [
      {
        label: t('Order.searchOrders'),
        value: 'orderNumber' as keyof OrderResponse,
        placeholder: t('Order.searchByOrderNumber')
      }
    ],
    []
  );

  const { table } = useDataTable({
    data: [] as OrderResponse[],
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
  const queryParams = useMemo(() => {
    const searchFilter = columnFilters.find((filter) => filter.id === 'orderNumber');
    const sortConfig = sorting[0];

    const params: Record<string, string | number> = {
      page: pagination.pageIndex,
      size: pagination.pageSize,
      ...initialFilters
    };

    if (sortConfig) {
      params.sortBy = sortConfig.id;
      params.sortDirection = sortConfig.desc ? 'desc' : 'asc';
    }

    if (searchFilter?.value) {
      params.search = String(searchFilter.value);
    }

    return params;
  }, [pagination, sorting, columnFilters, initialFilters]);
  const { data: ordersResponse, isLoading } = useCustomerOrders({
    data: queryParams
  });

  const orders = ordersResponse?.result?.content || [];
  const pageCount = ordersResponse?.result?.totalPages || 0;

  table.options.data = orders;
  table.options.pageCount = pageCount;

  return (
    <>
      <DataTable classNameHeader="bg-primary text-primary-foreground hover:bg-primary/80" isLoading={isLoading} table={table}>
        <DataTableToolbar filterFields={filterFields} table={table}>
          <TasksTableToolbarActions
            table={table}
            createAction={{
              label: 'Xuất Excel',
              action: () => {}
            }}
          />
        </DataTableToolbar>
      </DataTable>

      <CustomerOrderDetailDialog
        isOpen={isDialogOpen}
        order={selectedOrder}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedOrder(null);
        }}
      />
    </>
  );
});

CustomerOrdersTable.displayName = 'CustomerOrdersTable';
