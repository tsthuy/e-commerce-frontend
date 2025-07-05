import { memo } from 'react';

import { Gift, Shield, ShoppingCart, Wallet } from 'lucide-react';

import { useTranslation } from '~/hooks';

import { Button } from '~/components/common';

export const Guarantee = memo(() => {
  const { t } = useTranslation();

  const guarantees = [
    {
      icon: ShoppingCart,
      title: t('Common.freeShipping'),
      description: t('Common.freeShippingDesc')
    },
    {
      icon: Gift,
      title: t('Common.dailySurpriseOffers'),
      description: t('Common.dailySurpriseOffersDesc')
    },
    {
      icon: Wallet,
      title: t('Common.affordablePrices'),
      description: t('Common.affordablePricesDesc')
    },
    {
      icon: Shield,
      title: t('Common.securePayments'),
      description: t('Common.securePaymentsDesc')
    }
  ];

  return (
    <div className="bg-white">
      <div className="mx-auto flex w-full max-w-[calc(1280px+4px*4*2)] flex-wrap gap-16 px-4">
        {guarantees.map(({ icon: Icon, title, description }, index) => (
          <div key={index} className="flex w-full items-center justify-center py-14 sm:w-[calc((100%-64px)/2)] xl:w-[calc((100%-64px*3)/4)]">
            <Button variant="ghost">
              <Icon className="size-10 text-custom-primary-bg-hover" />
            </Button>

            <div className="ml-4">
              <h4 className="text-xl font-bold">{title}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
