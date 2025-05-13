import { memo } from 'react';

import { SEO_CATEGORY } from '~/constants';

export const Categories = memo(() => {
  return (
    <div className="bg-white py-8">
      <div className="mx-auto max-w-[calc(1280px+4px*4*2)] px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {SEO_CATEGORY.map((category) => (
            <div key={category.id} className="group flex flex-col items-center rounded-lg border p-4 transition-all hover:shadow-md">
              <div className="mb-3 h-40 w-full overflow-hidden rounded-md">
                <img alt={category.title} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" src={category.image_Url} />
              </div>
              <h3 className="text-center text-lg font-medium capitalize text-gray-800">{category.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
