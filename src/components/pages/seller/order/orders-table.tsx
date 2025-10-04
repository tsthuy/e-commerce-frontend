import { memo, useMemo, useState } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import type { AnyType, OrderResponse, OrderStatusTransition } from '~/types';
import { OrderStatus } from '~/types';

import { useDataTable, useTranslation } from '~/hooks';

import { formatDate, formatPrice } from '~/utils';

import { DataTable, DataTableColumnHeader, DataTableToolbar, TasksTableToolbarActions } from '~/components/common';
import { Badge, Button } from '~/components/ui';

import { OrderDetailDialog } from './order-detail-dialog';
import { OrderStatusDropdown } from './order-status-dropdown';

import { useSellerOrders } from '~/hooks/use-order.hook';
import { useUpdateOrderStatusMutation } from '~/queries/order.mutation';
import type { PaginationParams } from '~/types/common';

interface OrdersTableProps {
  onViewOrder?: (order: OrderResponse) => void;
  initialFilters?: Partial<PaginationParams & { status?: OrderStatus }>;
}

export const OrdersTable = memo<OrdersTableProps>(({ onViewOrder, initialFilters = {} }) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { t } = useTranslation();
  const updateOrderStatusMutation = useUpdateOrderStatusMutation();

  const getAvailableTransitions = (currentStatus: OrderStatus): OrderStatusTransition[] => {
    const transitions: Record<OrderStatus, OrderStatusTransition[]> = {
      [OrderStatus.PENDING]: [
        { status: OrderStatus.CONFIRMED, label: t('Order.confirmOrder'), description: t('Order.confirmOrderDescription') },
        { status: OrderStatus.CANCELLED, label: t('Order.cancelOrder'), description: t('Order.cancelOrderDescription') }
      ],
      [OrderStatus.CONFIRMED]: [
        { status: OrderStatus.PROCESSING, label: t('Order.startProcessing'), description: t('Order.startProcessingDescription') },
        { status: OrderStatus.CANCELLED, label: t('Order.cancelOrder'), description: t('Order.cancelOrderDescription') }
      ],
      [OrderStatus.PROCESSING]: [{ status: OrderStatus.SHIPPED, label: t('Order.shipOrder'), description: t('Order.shipOrderDescription') }],
      [OrderStatus.SHIPPED]: [{ status: OrderStatus.DELIVERED, label: t('Order.deliverOrder'), description: t('Order.deliverOrderDescription') }],
      [OrderStatus.DELIVERED]: [{ status: OrderStatus.COMPLETED, label: t('Order.completeOrder'), description: t('Order.completeOrderDescription') }],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: []
    };

    return transitions[currentStatus] || [];
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus): void => {
    updateOrderStatusMutation.mutate({
      orderId,
      data: { status: newStatus }
    });
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
        accessorKey: 'customerName',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Common.customer')} />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          return (
            <div>
              <div className="font-medium">{order.customerName || t('Order.notAvailable')}</div>
              <div className="text-sm text-muted-foreground">{order.customerEmail || ''}</div>
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
              <img alt={t('Order.orderImage')} className="h-12 w-12 object-cover" src={order.items[0]?.variantImageUrl || order.items[0]?.productImageUrl} />
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
          const order = row.original;
          const availableTransitions = getAvailableTransitions(order.status);

          return (
            <OrderStatusDropdown
              availableTransitions={availableTransitions}
              currentStatus={order.status}
              isLoading={updateOrderStatusMutation.isPending}
              orderId={order.id}
              onStatusChange={(newStatus) => handleStatusUpdate(order.id, newStatus)}
            />
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        accessorKey: 'itemCount',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Common.quantity')} />,
        cell: ({ row }): JSX.Element => {
          const order = row.original;
          const itemCount = order.items?.length || 0;
          const totalQty = order.items?.reduce((sum: number, item) => sum + item.quantity, 0) || 0;
          return (
            <div className="text-sm">
              <div>
                {itemCount} {t('Product.products')}
              </div>
              <div className="text-muted-foreground">
                {totalQty} {t('Product.items')}
              </div>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: true
      },
      {
        accessorKey: 'paymentMethod',
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Order.orderPayment')} />,
        cell: ({ row }): JSX.Element => {
          const paymentMethod = row.getValue('paymentMethod') as string;
          const paymentConfig = {
            CASH_ON_DELIVERY: { label: t('Order.paymentMethods.CASH_ON_DELIVERY'), color: 'warning' },
            CREDIT_CARD: { label: t('Order.paymentMethods.CREDIT_CARD'), color: 'primary' },
            BANK_TRANSFER: { label: t('Order.paymentMethods.BANK_TRANSFER'), color: 'info' },
            E_WALLET: { label: t('Order.paymentMethods.E_WALLET'), color: 'success' }
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
        header: ({ column }): JSX.Element => <DataTableColumnHeader column={column} title={t('Common.date')} />,
        cell: ({ row }): JSX.Element => {
          const date = row.getValue('createdAt') as string;
          return (
            <div className="text-sm">
              <Badge className="border-yellow-300 bg-yellow-100 text-yellow-800" variant="outline">
                {formatDate(date, 'DD/MM/YYYY HH:mm')}
              </Badge>
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        id: 'actions',
        header: t('Common.actions'),
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
    [updateOrderStatusMutation.isPending, onViewOrder, t]
  );
  const filterFields = useMemo(
    () => [
      {
        label: t('Order.searchOrdersLabel'),
        value: 'orderNumber' as keyof OrderResponse,
        placeholder: t('Order.searchOrdersHint')
      }
    ],
    [t]
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
  const { data: ordersResponse, isLoading } = useSellerOrders({
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
              label: t('Order.exportExcel'),
              action: () => {}
            }}
          />
        </DataTableToolbar>
      </DataTable>

      <OrderDetailDialog
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

OrdersTable.displayName = 'OrdersTable';
