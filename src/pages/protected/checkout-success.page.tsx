import { memo, useEffect } from 'react';

import { CheckCircle } from 'lucide-react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { httpBase } from '~/services';

import { Button, Helmet } from '~/components/common';

import { useTranslation } from '~/hooks/use-translation.hook';
import { PROTECTED_ROUTES } from '~/routes/protected.route';

interface RouteParams {
  orderId?: string;
}

export const CheckoutSuccessPage = memo(() => {
  const { push } = useHistory();
  const { orderId } = useParams<RouteParams>();
  const { t } = useTranslation();

  useEffect(() => {
    if (orderId) {
      // Confirm payment with backend
      httpBase
        .post(`/api/stripe/confirm-payment/${orderId}`)
        .then(() => {
          toast.success(t('CheckoutSuccess.paymentSuccess'));
        })
        .catch((error) => {
          console.error('Error confirming payment:', error);
          // Don't show error to user since payment might already be confirmed by webhook
        });
    }
  }, [orderId, t]);

  return (
    <Helmet title={t('CheckoutSuccess.title')}>
      <div className="container py-8">
        <div className="mx-auto max-w-2xl text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h1 className="mb-4 text-2xl font-bold">{t('CheckoutSuccess.heading')}</h1>
          <p className="mb-8 text-muted-foreground">{t('CheckoutSuccess.message')}</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => push(PROTECTED_ROUTES.orders.path())}>{t('CheckoutSuccess.viewOrders')}</Button>
            <Button variant="outline" onClick={() => push('/')}>
              {t('CheckoutSuccess.continueShopping')}
            </Button>
          </div>
        </div>
      </div>
    </Helmet>
  );
});
