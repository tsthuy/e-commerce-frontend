import { memo, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { useProductDetail, useTranslation } from '~/hooks';

import { Container, Helmet, SpinnerSquare } from '~/components/common';
import { ProductDetailContent } from '~/components/pages/public/product-detail';

import { useStableBehaviorTracking } from '~/hooks/use-stable-behavior-tracking.hook';

export const ProductDetailPage = memo(() => {
  const { productId } = useParams<{ productId: string }>();
  const { t } = useTranslation();
  const { trackBehavior } = useStableBehaviorTracking();

  const [hasTrackedLinger, setHasTrackedLinger] = useState(false);

  const {
    data: product,
    isLoading,
    isError
  } = useProductDetail({
    data: { productId },
    enabled: !!productId
  });
  useEffect(() => {
    if (productId) {
      trackBehavior({
        productId,
        actionType: 'VIEW'
      });
    }
  }, [productId, trackBehavior]);
  useEffect(() => {
    setHasTrackedLinger(false);
  }, [productId]);

  useEffect(() => {
    if (!productId || hasTrackedLinger) return;

    let timeoutId: NodeJS.Timeout;
    let mouseMoveCount = 0;

    const handleMouseMove = (): void => {
      mouseMoveCount++;

      if (mouseMoveCount >= 3 && !hasTrackedLinger) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (!hasTrackedLinger) {
            trackBehavior({
              productId,
              actionType: 'LINGER'
            });
            setHasTrackedLinger(true);
          }
        }, 10000);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return (): void => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [productId, hasTrackedLinger, trackBehavior]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SpinnerSquare />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('Product.notFound')}</h1>
          <p className="mt-2 text-gray-600">{t('Product.notFoundDesc')}</p>
        </div>
      </Container>
    );
  }

  return (
    <Helmet title={product.name}>
      <Container className="py-8">
        <ProductDetailContent product={product} />
      </Container>
    </Helmet>
  );
});
