import { memo } from 'react';

import { CheckIcon, UserRound, ZapIcon } from 'lucide-react';

import { DEFAULT_IMG_AVATAR } from '~/constants';

import { Avatar, DetailsSection, Helmet } from '~/components/common';
import { ContentAdminLayout } from '~/components/layouts/admin';
import { Badge } from '~/components/ui';

export const AvatarBadgePage = memo(() => {
  return (
    <Helmet title="Avatar and Badge">
      <ContentAdminLayout breadcrumb={[{ label: 'Storybook' }, { label: 'Components' }, { label: 'Avatar and Badge' }]}>
        <DetailsSection isHaveData>
          <div className="mb-10">
            <h2 className="mb-2 text-center text-xl font-bold">Avatar and Badge</h2>
            <p className="text-center text-base text-muted-foreground">A growing collection of avatar and badge components.</p>
          </div>
          <div className="components__wrapper">
            <div className="components__item flex flex-col items-center justify-center">
              <Avatar src={DEFAULT_IMG_AVATAR} />
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Avatar content="H" src="" />
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Avatar content={<UserRound className="size-4 opacity-60" />} src="" />
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Avatar square />
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Avatar showStatus={{ status: 'on' }} />
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Avatar showStatus={{ status: 'off' }} />
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Avatar square showStatus={{ status: 'on', classNameOn: '-end-1 -top-1 bottom-auto bg-custom-green-secondary' }} />
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Avatar showVerify />
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Avatar square showVerify={{ className: 'text-custom-green-secondary' }} />
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <div className="flex -space-x-[0.6rem]">
                {[...new Array(4)].map((_, index) => (
                  <Avatar key={index} className="rounded-full ring-2 ring-background" />
                ))}
              </div>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <div className="flex items-center rounded-full bg-muted p-0.5 shadow">
                <div className="flex -space-x-3">
                  {[...new Array(2)].map((_, index) => (
                    <Avatar key={index} className="rounded-full ring-2 ring-muted" />
                  ))}
                </div>
                <Avatar className="rounded-full [&>span]:bg-transparent [&>span]:text-muted-foreground" content="+2" src="" />
              </div>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <div className="flex items-center rounded-full border border-border bg-background p-1 shadow shadow-black/5">
                <div className="flex -space-x-1.5">
                  {[...new Array(2)].map((_, index) => (
                    <Avatar key={index} className="size-5 rounded-full ring-1 ring-background" />
                  ))}
                </div>
                <p className="px-2 text-xs text-muted-foreground">
                  Trusted by <strong className="font-medium text-foreground">60K+</strong> developers.
                </p>
              </div>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Badge>Badge</Badge>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Badge className="rounded">Badge</Badge>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Badge className="gap-1">
                <ZapIcon className="-ms-0.5 size-3 opacity-85" />
                Badge
              </Badge>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Badge className="aspect-square justify-center rounded-full p-1 leading-none">6</Badge>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Badge className="gap-1" variant="outline">
                <CheckIcon className="-ms-0.5 size-3 text-custom-green" />
                Badge
              </Badge>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Badge className="gap-1" variant="outline">
                <span className="-ms-0.5 size-1.5 rounded-full bg-custom-green" />
                Badge
              </Badge>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Badge className="gap-1" variant="outline">
                <span className="-ms-0.5 size-1.5 rounded-full bg-amber-500" />
                Badge
              </Badge>
            </div>
            <div className="components__item flex flex-col items-center justify-center">
              <Badge className="gap-1" variant="outline">
                <span className="-ms-0.5 size-1.5 rounded-full bg-destructive" />
                Badge
              </Badge>
            </div>
          </div>
        </DetailsSection>
      </ContentAdminLayout>
    </Helmet>
  );
});
