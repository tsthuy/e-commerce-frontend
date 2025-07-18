import { CheckCircle } from 'lucide-react';
import { memo, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Button, Helmet } from '~/components/common';
import { PROTECTED_ROUTES } from '~/routes/protected.route';
import { httpBase } from '~/services';

interface RouteParams {
  orderId?: string;
}

export const CheckoutSuccessPage = memo(() => {
  const { push } = useHistory();
  const { orderId } = useParams<RouteParams>();

  useEffect(() => {
    if (orderId) {
      // Confirm payment with backend
      httpBase.post(`/api/stripe/confirm-payment/${orderId}`)
        .then(() => {
          toast.success('Thanh toán thành công');
        })
        .catch((error) => {
          console.error('Error confirming payment:', error);
          // Don't show error to user since payment might already be confirmed by webhook
        });
    }
  }, [orderId]);

  return (
    <Helmet title="Thanh toán thành công">
      <div className="container py-8">
        <div className="mx-auto max-w-2xl text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h1 className="mb-4 text-2xl font-bold">Thanh toán thành công!</h1>
          <p className="mb-8 text-muted-foreground">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => push(PROTECTED_ROUTES.orders.path())}>
              Xem đơn hàng
            </Button>
            <Button variant="outline" onClick={() => push('/')}>
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
      </div>
    </Helmet>
  );
}); 