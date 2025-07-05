import { memo, useEffect, useState } from 'react';

import { ChevronDown } from 'lucide-react';

import type { AnyType, OrderStatus, OrderStatusTransition } from '~/types';

import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui';

import { orderApi } from '~/services/order.api';

interface OrderStatusDropdownProps {
  currentStatus: OrderStatus;
  orderId: string;
  onStatusChange: (newStatus: OrderStatus) => void;
  isLoading?: boolean;
  disabled?: boolean;
  availableTransitions?: OrderStatusTransition[];
}

const getStatusConfig = (status: OrderStatus): { label: string; color: string } => {
  const statusConfig = {
    PENDING: { label: 'Chờ xác nhận', color: 'warning' },
    CONFIRMED: { label: 'Đã xác nhận', color: 'info' },
    PROCESSING: { label: 'Đang chuẩn bị', color: 'info' },
    SHIPPED: { label: 'Đang giao hàng', color: 'primary' },
    DELIVERED: { label: 'Đã giao hàng', color: 'success' },
    COMPLETED: { label: 'Hoàn thành', color: 'success' },
    CANCELLED: { label: 'Đã hủy', color: 'danger' },
    REFUNDED: { label: 'Đã hoàn tiền', color: 'warning' }
  };

  return statusConfig[status] || { label: status, color: 'default' };
};

export const OrderStatusDropdown = memo<OrderStatusDropdownProps>(({ currentStatus, orderId, onStatusChange, isLoading = false, disabled = false, availableTransitions: providedTransitions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transitions, setTransitions] = useState<OrderStatusTransition[]>([]);

  const currentStatusConfig = getStatusConfig(currentStatus);

  // Fetch available transitions if not provided
  useEffect(() => {
    if (providedTransitions) {
      setTransitions(providedTransitions);
      return;
    }

    const fetchTransitions = async (): Promise<void> => {
      try {
        const response = await orderApi.getStatusTransitions(orderId);
        setTransitions(response.data.result || []);
      } catch (error) {
        console.error('Failed to fetch status transitions:', error);
        setTransitions([]);
      }
    };

    fetchTransitions();
  }, [orderId, providedTransitions]);

  const handleStatusChange = (newStatus: OrderStatus): void => {
    onStatusChange(newStatus);
    setIsOpen(false);
  };

  // If no available transitions, just show current status
  if (!transitions || transitions.length === 0) {
    return <Badge color={currentStatusConfig.color as AnyType}>{currentStatusConfig.label}</Badge>;
  }

  return (
    <div className="flex w-full items-center gap-2">
      <Badge className="w-full flex-1 justify-center" color={currentStatusConfig.color as AnyType}>
        {currentStatusConfig.label}
      </Badge>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="h-7 px-2" disabled={disabled || isLoading} size="sm" variant="outline">
            {isLoading ? <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64d">
          {transitions.map((transition) => {
            const statusConfig = getStatusConfig(transition.status);
            return (
              <DropdownMenuItem key={transition.status} className="flex items-center justify-between gap-2" disabled={transition.disabled} onClick={() => handleStatusChange(transition.status)}>
                <div className="flex flex-col">
                  <span className="font-medium">{transition.label}</span>
                  {transition.description && <span className="text-xs text-muted-foreground">{transition.description}</span>}
                </div>
                <Badge className="text-xs" color={statusConfig.color as AnyType} variant="outline">
                  {statusConfig.label}
                </Badge>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

OrderStatusDropdown.displayName = 'OrderStatusDropdown';
