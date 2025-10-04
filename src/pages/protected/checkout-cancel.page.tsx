import { memo, useEffect } from 'react';

import { XCircle } from 'lucide-react';
import { useHistory, useParams } from 'react-router-dom';

import { httpBase } from '~/services';

import { Button, Helmet } from '~/components/common';

import { useTranslation } from '~/hooks/use-translation.hook';

export const CheckoutCancelPage = memo(() => {
  const { push } = useHistory();
  const { orderId } = useParams<{ orderId?: string }>();
  const { t } = useTranslation();

  useEffect(() => {
    if (orderId) {
      httpBase.put(`/api/stripe/cancel-order/${orderId}`).catch((error) => {
        console.error('Error cancelling order:', error);
      });
    }
  }, [orderId]);

  return (
    <Helmet title={t('CheckoutCancel.title')}>
      <div className="container py-8">
        <div className="mx-auto max-w-2xl text-center">
          <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h1 className="mb-4 text-2xl font-bold">{t('CheckoutCancel.heading')}</h1>
          <p className="mb-8 text-muted-foreground">{t('CheckoutCancel.message')}</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => push('/user/checkout')}>{t('CheckoutCancel.tryAgain')}</Button>
            <Button variant="outline" onClick={() => push('/')}>
              {t('CheckoutCancel.continueShopping')}
            </Button>
          </div>
        </div>
      </div>
    </Helmet>
  );
});
