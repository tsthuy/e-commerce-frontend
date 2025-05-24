import { memo } from 'react';

import { Eye, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

import { DEFAULT_IMG_SAMPLE } from '~/constants';

import { Button } from '~/components/common';
import { renderStars } from '~/components/product/star';

export const ProductCard = memo(() => {
  return (
    <div className="w-full max-w-xs overflow-hidden rounded-lg border bg-white">
      <div className="relative flex w-full justify-center">
        <div className="size-[60%] py-4">
          <img alt="sample" className={'aspect-square object-contain transition-transform duration-300 hover:scale-105'} src={DEFAULT_IMG_SAMPLE} />
        </div>
        <div className="top- absolute right-0 flex flex-col">
          <Button className="w-fit" variant={'ghost'}>
            <Heart />
          </Button>
          <Button className="w-fit" variant={'ghost'}>
            <Eye />
          </Button>
          <Button className="w-fit" variant={'ghost'}>
            <ShoppingCart />
          </Button>
        </div>
      </div>
      <div className="flex flex-col space-y-2 px-4 py-4">
        <Link className="text-lg font-bold hover:text-primary hover:underline" to={'#'}>
          Sample Product 123
        </Link>

        <div className="flex">{renderStars(4.5)}</div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-primary">$90</span>
            <span className="text-lg font-medium text-black line-through opacity-50">$120</span>
          </div>
          <span className="font-bold text-custom-green">2 sold</span>
        </div>
      </div>
    </div>
  );
});
