/* eslint-disable jsx-a11y/label-has-associated-control */
import { memo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';

import type { AdminCustomerResponse } from '~/types/admin-customer';

interface AdminCustomerDetailDialogProps {
  customer: AdminCustomerResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminCustomerDetailDialog = memo<AdminCustomerDetailDialogProps>(({ customer, open, onOpenChange }) => {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage alt={customer.fullName} src={customer.avatar?.url} />
              <AvatarFallback className="text-lg">
                {customer.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{customer.fullName}</h3>
              <p className="text-muted-foreground">{customer.email}</p>
              <div className="mt-2">
                <Badge variant={customer.createdViaOAuth ? 'default' : 'secondary'}>{customer.createdViaOAuth ? 'OAuth Account' : 'Local Account'}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="mt-1">{customer.phone || 'Not provided'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <p className="mt-1">{new Date(customer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-md font-semibold">Order Statistics</h4>
            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{customer.totalOrders}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">${customer.totalSpent.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
            <p className="mt-1 text-sm">{new Date(customer.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

AdminCustomerDetailDialog.displayName = 'AdminCustomerDetailDialog';
