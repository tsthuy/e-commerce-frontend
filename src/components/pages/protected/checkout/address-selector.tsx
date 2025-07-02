import { memo } from 'react';

import { MapPin, Plus } from 'lucide-react';

import type { UserAddress } from '~/types';

import { Button } from '~/components/common';
import { RadioGroup, RadioGroupItem } from '~/components/ui';

import { PROTECTED_ROUTES } from '~/routes/protected.route';

interface AddressSelectorProps {
  addresses: UserAddress[];
  selectedAddressId: string;
  onSelectAddress: (addressId: string) => void;
}

export const AddressSelector = memo(({ addresses, selectedAddressId, onSelectAddress }: AddressSelectorProps): JSX.Element => {
  const handleAddNewAddress = (): void => {
    window.location.href = PROTECTED_ROUTES.address.path();
  };

  if (addresses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-medium">Không có địa chỉ nào</h3>
        <p className="mb-4 text-muted-foreground">Vui lòng thêm địa chỉ giao hàng mới</p>
        <Button variant="outline" onClick={handleAddNewAddress}>
          <Plus className="mr-2 h-4 w-4" /> Thêm địa chỉ mới
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedAddressId} onValueChange={onSelectAddress}>
        {addresses.map((address) => (
          <div key={address.id} className={`flex items-start space-x-3 rounded-md border p-4 transition-colors ${selectedAddressId === address.id ? 'border-primary bg-primary/5' : ''}`}>
            <RadioGroupItem className="mt-1" id={address.id} value={address.id} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <label className="flex cursor-pointer items-center font-medium" htmlFor={address.id}>
                  <span>{address.addressType}</span>
                  {address.isDefault && <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">Mặc định</span>}
                </label>
              </div>
              <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                <p>{`${address.address}, ${address.city}, ${address.country}`}</p>
                <p>Số điện thoại: {address.recipientPhone}</p>
                {address.zipCode && <p>Mã bưu điện: {address.zipCode}</p>}
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>

      <div className="mt-4 flex justify-end">
        <Button size="sm" variant="outline" onClick={handleAddNewAddress}>
          <Plus className="mr-1 h-4 w-4" /> Thêm địa chỉ mới
        </Button>
      </div>
    </div>
  );
});
