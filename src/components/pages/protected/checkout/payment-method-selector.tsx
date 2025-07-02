import { memo } from 'react';

import { BanknoteIcon, CreditCard, Landmark, Wallet } from 'lucide-react';

import { RadioGroup, RadioGroupItem } from '~/components/ui';

import type { PaymentMethod } from '~/types/order';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

const PAYMENT_METHODS = [
  {
    id: 'CASH_ON_DELIVERY',
    name: 'Thanh toán khi nhận hàng',
    description: 'Trả tiền mặt khi nhận được hàng',
    icon: BanknoteIcon
  },
  {
    id: 'CREDIT_CARD',
    name: 'Thẻ tín dụng / Ghi nợ',
    description: 'Thanh toán an toàn với thẻ của bạn',
    icon: CreditCard
  },
  {
    id: 'BANK_TRANSFER',
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển tiền trực tiếp đến tài khoản của chúng tôi',
    icon: Landmark
  },
  {
    id: 'E_WALLET',
    name: 'Ví điện tử',
    description: 'Sử dụng ví điện tử như Momo, ZaloPay, VNPay...',
    icon: Wallet
  }
];

export const PaymentMethodSelector = memo(({ selectedMethod, onSelectMethod }: PaymentMethodSelectorProps): JSX.Element => {
  return (
    <RadioGroup value={selectedMethod} onValueChange={onSelectMethod as (value: string) => void}>
      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          return (
            <div key={method.id} className={`flex items-start space-x-3 rounded-md border p-4 transition-colors ${selectedMethod === method.id ? 'border-primary bg-primary/5' : ''}`}>
              <RadioGroupItem className="mt-1" id={method.id} value={method.id} />
              <div className="flex flex-1 items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer" htmlFor={method.id}>
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-muted-foreground">{method.description}</div>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </RadioGroup>
  );
});
