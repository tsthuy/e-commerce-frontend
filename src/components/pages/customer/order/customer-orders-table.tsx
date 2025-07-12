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
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title="Mã đơn hàng" />,
        cell: ({ row }): JSX.Element => <div className="font-mono text-sm">{row.getValue('orderNumber')}</div>,
        enableSorting: true,
        enableHiding: false
      },
      {
        accessorKey: 'sellerShopName',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title="Người bán" />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          return (
            <div>
              <div className="font-medium">{order.sellerShopName}</div>
              <div className="text-sm text-muted-foreground">{order.sellerName}</div>
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'total',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title="Tổng tiền" />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          return <div className="text-right font-medium">{formatPrice(order.total)}</div>;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'status',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          return getStatusBadge(order.status);
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'items',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title="Số lượng" />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          const totalQty = order.items?.reduce((sum: number, item) => sum + item.quantity, 0) || 0;
          return (
            <div className="text-center">
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
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title="Thanh toán" />,
        cell: ({ row }): JSX.Element => {
          const paymentMethod = row.getValue('paymentMethod') as string;
          const paymentConfig = {
            CASH_ON_DELIVERY: { label: 'COD', color: 'warning' },
            CREDIT_CARD: { label: 'Thẻ tín dụng', color: 'primary' },
            BANK_TRANSFER: { label: 'Chuyển khoản', color: 'info' },
            E_WALLET: { label: 'Ví điện tử', color: 'success' }
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
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title="Ngày đặt" />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          return <div className="text-sm">{formatDate(order.createdAt)}</div>;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        id: 'actions',
        header: 'Thao tác',
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

  // Filter fields for search and filtering
  const filterFields = useMemo(
    () => [
      {
        label: 'Tìm kiếm đơn hàng',
        value: 'orderNumber' as keyof OrderResponse,
        placeholder: 'Tìm theo mã đơn hàng...'
      }
    ],
    []
  );

  // Initialize table with empty data first to get state
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

  // Get current table state for API call
  const pagination = table.getState().pagination;
  const sorting = table.getState().sorting;
  const columnFilters = table.getState().columnFilters;

  // Build query parameters from table state
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

  // Fetch data with dynamic parameters
  const { data: ordersResponse, isLoading } = useCustomerOrders({
    data: queryParams
  });

  const orders = ordersResponse?.result?.content || [];
  const pageCount = ordersResponse?.result?.totalPages || 0;

  // Update table options with fetched data
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
