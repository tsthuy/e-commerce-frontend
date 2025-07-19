import { memo } from 'react';

import { BanknoteIcon, CreditCard } from 'lucide-react';

import { RadioGroup, RadioGroupItem } from '~/components/ui';

import { useTranslation } from '~/hooks/use-translation.hook';
import type { PaymentMethod } from '~/types/order';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector = memo(({ selectedMethod, onSelectMethod }: PaymentMethodSelectorProps): JSX.Element => {
  const { t } = useTranslation();

  const PAYMENT_METHODS = [
    {
      id: 'CASH_ON_DELIVERY' as PaymentMethod,
      name: t('Checkout.paymentMethods.CASH_ON_DELIVERY'),
      description: t('Checkout.paymentMethodsDescriptions.CASH_ON_DELIVERY'),
      icon: BanknoteIcon
    },
    {
      id: 'ADVANCE_PAYMENT' as PaymentMethod,
      name: t('Checkout.paymentMethods.ADVANCE_PAYMENT'),
      description: t('Checkout.paymentMethodsDescriptions.ADVANCE_PAYMENT'),
      icon: CreditCard
    }
  ];

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
