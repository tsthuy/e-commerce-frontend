import { XCircle } from 'lucide-react';
import { memo } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, Helmet } from '~/components/common';

export const CheckoutCancelPage = memo(() => {
  const { push } = useHistory();

  return (
    <Helmet title="Thanh toán thất bại">
      <div className="container py-8">
        <div className="mx-auto max-w-2xl text-center">
          <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h1 className="mb-4 text-2xl font-bold">Thanh toán thất bại</h1>
          <p className="mb-8 text-muted-foreground">
            Rất tiếc, thanh toán của bạn không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => push('/checkout')}>
              Thử lại
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