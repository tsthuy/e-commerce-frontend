/* eslint-disable jsx-a11y/label-has-associated-control */
import { memo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';

import type { AdminSellerResponse } from '~/types/admin-seller';

interface AdminSellerDetailDialogProps {
  seller: AdminSellerResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminSellerDetailDialog = memo<AdminSellerDetailDialogProps>(({ seller, open, onOpenChange }) => {
  if (!seller) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seller Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seller Info */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage alt={seller.shopName} src={seller.avatar?.url} />
              <AvatarFallback className="text-lg">
                {seller.shopName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{seller.shopName}</h3>
              <p className="text-muted-foreground">{seller.email}</p>
              <div className="mt-2">
                <Badge variant={seller.createdViaOAuth ? 'default' : 'secondary'}>{seller.createdViaOAuth ? 'OAuth Account' : 'Local Account'}</Badge>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="mt-1">{seller.phone || 'Not provided'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <p className="mt-1">{new Date(seller.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Business Statistics */}
          <div className="space-y-3">
            <h4 className="text-md font-semibold">Business Statistics</h4>
            <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{seller.totalProducts || '0'}</p>
                <p className="text-sm text-muted-foreground">Total Products</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{seller.totalOrders}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">${(seller.availableAmount && seller.availableAmount.toFixed(2)) || '0'}</p>
                <p className="text-sm text-muted-foreground">Available Amount</p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
            <p className="mt-1 text-sm">{new Date(seller.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

AdminSellerDetailDialog.displayName = 'AdminSellerDetailDialog';
