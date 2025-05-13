import { memo } from 'react';

import { SEO_GUARANTEES } from '~/constants';

import { Button } from '~/components/common';

export const Guarantee = memo(() => {
  return (
    <div className="bg-white">
      <div className="mx-auto flex w-full max-w-[calc(1280px+4px*4*2)] flex-wrap justify-center gap-16">
        {SEO_GUARANTEES.map(({ icon: Icon, title, description }, index) => (
          <div key={index} className="flex items-center py-14">
            <Button variant="ghost">
              <Icon className="size-10 text-custom-primary-bg-hover" />
            </Button>

            <div className="">
              <h4 className="text-xl font-bold">{title}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
