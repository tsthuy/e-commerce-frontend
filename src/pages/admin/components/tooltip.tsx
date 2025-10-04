import { memo } from 'react';

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, CircleIcon, GlobeIcon } from 'lucide-react';

import { renderPlaceholderImage } from '~/utils';

import { Button, DetailsSection, Helmet, Tooltip } from '~/components/common';
import { ContentAdminLayout } from '~/components/layouts/admin/content';

export const TooltipPage = memo(() => {
  return (
    <Helmet title="Tooltip">
      <ContentAdminLayout breadcrumb={[{ label: 'Storybook' }, { label: 'Components' }, { label: 'Tooltip' }]}>
        <DetailsSection isHaveData>
          <div className="mb-10">
            <h2 className="mb-2 text-center text-xl font-bold">Tooltip</h2>
            <p className="text-center text-base text-muted-foreground">A growing collection of tooltip components.</p>
          </div>
          <div className="components__wrapper">
            <div className="components__item flex flex-col items-center justify-center">
              <Tooltip content="This is simple tooltip">
                <Button variant="outline">Simple tooltip</Button>
              </Tooltip>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Tooltip content="This is tiny tooltip" size="tiny">
                <Button size="sm" variant="outline">
                  Tiny tooltip
                </Button>
              </Tooltip>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Tooltip showArrow content="This tooltip has an arrow">
                <Button variant="outline">W/ arrow</Button>
              </Tooltip>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Tooltip
                className="py-3"
                content={
                  <div className="space-y-1">
                    <p className="font-medium">Tooltip with title</p>
                    <p className="text-xs text-muted-foreground">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam obcaecati voluptatum officia. Ex, et temporibus hic consequatur recusandae sit cupiditate aliquid, at enim
                      molestiae eaque possimus quam? Ea, eaque voluptatem!
                    </p>
                  </div>
                }
              >
                <Button variant="outline">W/ title</Button>
              </Tooltip>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Tooltip
                className="py-3"
                content={
                  <div className="flex gap-3">
                    <GlobeIcon className="mt-0.5 size-4 shrink-0 opacity-60" />
                    <div className="space-y-1">
                      <p className="font-medium">Tooltip with title and icon</p>
                      <p className="text-xs text-muted-foreground">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam obcaecati voluptatum officia. Ex, et temporibus hic consequatur recusandae sit cupiditate aliquid, at enim
                        molestiae eaque possimus quam? Ea, eaque voluptatem!
                      </p>
                    </div>
                  </div>
                }
              >
                <Button variant="outline">W/ icon</Button>
              </Tooltip>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Tooltip
                className="py-3"
                content={
                  <div className="space-y-2">
                    <img alt="Content banner" className="aspect-[2/1] w-full rounded" src={renderPlaceholderImage({ text: 'Banner', width: 200, height: 100 })} />
                    <div className="space-y-1">
                      <p className="font-medium">Tooltip with title and image</p>
                      <p className="text-xs text-muted-foreground">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam obcaecati voluptatum officia. Ex, et temporibus hic consequatur recusandae sit cupiditate aliquid, at enim
                        molestiae eaque possimus quam? Ea, eaque voluptatem!
                      </p>
                    </div>
                  </div>
                }
              >
                <Button variant="outline">W/ image</Button>
              </Tooltip>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <div className="inline-grid w-fit grid-cols-3 gap-1">
                <Tooltip content="Top" side="top">
                  <Button className="col-start-2" size="icon" variant="outline">
                    <ChevronUpIcon className="size-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="Left" side="left">
                  <Button className="col-start-1" size="icon" variant="outline">
                    <ChevronLeftIcon className="size-4" />
                  </Button>
                </Tooltip>
                <div className="flex items-center justify-center">
                  <CircleIcon className="size-4 opacity-60" />
                </div>
                <Tooltip content="Right" side="right">
                  <Button size="icon" variant="outline">
                    <ChevronRightIcon className="size-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="Bottom" side="bottom">
                  <Button className="col-start-2" size="icon" variant="outline">
                    <ChevronDownIcon className="size-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Tooltip
                className="py-2"
                content={
                  <div className="space-y-2">
                    <div className="text-[13px] font-medium">Tuesday, Aug 13</div>
                    <div className="flex items-center gap-2 text-xs">
                      <svg aria-hidden="true" className="shrink-0 text-indigo-500" fill="currentColor" height="8" viewBox="0 0 8 8" width="8" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="4" cy="4" r="4"></circle>
                      </svg>
                      <span className="flex grow gap-2">
                        Sales <span className="ml-auto">$40</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <svg aria-hidden="true" className="shrink-0 text-purple-500" fill="currentColor" height="8" viewBox="0 0 8 8" width="8" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="4" cy="4" r="4"></circle>
                      </svg>
                      <span className="flex grow gap-2">
                        Revenue <span className="ml-auto">$74</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <svg aria-hidden="true" className="shrink-0 text-rose-500" fill="currentColor" height="8" viewBox="0 0 8 8" width="8" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="4" cy="4" r="4"></circle>
                      </svg>
                      <span className="flex grow gap-2">
                        Costs <span className="ml-auto">$410</span>
                      </span>
                    </div>
                  </div>
                }
              >
                <Button variant="outline">Chart</Button>
              </Tooltip>
            </div>
          </div>
        </DetailsSection>
      </ContentAdminLayout>
    </Helmet>
  );
});
