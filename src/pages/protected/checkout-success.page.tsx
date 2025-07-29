import { memo, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { queries } from '~/queries';

import { httpBase } from '~/services';

import { getErrorMessage } from '~/utils';

import { Button, Helmet } from '~/components/common';

import { useProfile } from '~/hooks/use-profile.hook';
import { useTranslation } from '~/hooks/use-translation.hook';
import { PROTECTED_ROUTES } from '~/routes/protected.route';

interface RouteParams {
  orderIds?: string;
}

export const CheckoutSuccessPage = memo(() => {
  const { push } = useHistory();
  const { orderIds } = useParams<RouteParams>();
  const { t } = useTranslation();
  const { data } = useProfile({ enabled: true });
  const queryClient = useQueryClient();

  useEffect(() => {
    const confirmPayments = async (): Promise<void> => {
      try {
        await httpBase.post(`/api/stripe/confirm-payment/${data?.id}`);
        queryClient.invalidateQueries({ queryKey: [...queries.cart._def] });
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    };
    if (orderIds) {
      confirmPayments();
    }
  }, [orderIds, t]);

  return (
    <Helmet title={t('CheckoutSuccess.title')}>
      <div className="container py-8">
        <div className="mx-auto max-w-2xl text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h1 className="mb-4 text-2xl font-bold">{t('CheckoutSuccess.heading')}</h1>

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
