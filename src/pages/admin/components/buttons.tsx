import { memo, useCallback, useState } from 'react';

import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CopyIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '~/libs';

import { copyToClipboard } from '~/utils';

import { Button, DetailsSection, Helmet, Tooltip } from '~/components/common';
import { ContentAdminLayout } from '~/components/layouts/admin/content';

export const ButtonsPage = memo(() => {
  const [open, setOpen] = useState<{
    [key: string]: boolean;
  }>({
    '1': false,
    '2': false,
    '3': false
  });

  const toggleSetOpen = useCallback(
    (key: string) => {
      setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [open]
  );

  const handleCopy = (): void => {
    if (open['3']) return;

    try {
      copyToClipboard('Hello World!');
      setOpen((prev) => ({ ...prev, '3': true }));
      setTimeout(() => setOpen((prev) => ({ ...prev, '3': false })), 1500);
    } catch (error) {
      console.error('handleCopy: ', error);
      toast.error('Something went wrong! Please try again.');
    }
  };

  return (
    <Helmet title="Buttons">
      <ContentAdminLayout breadcrumb={[{ label: 'Storybook' }, { label: 'Components' }, { label: 'Buttons' }]}>
        <DetailsSection isHaveData>
          <div className="mb-10">
            <h2 className="mb-2 text-center text-xl font-bold">Button</h2>
            <p className="text-center text-base text-muted-foreground">A growing collection of button components.</p>
          </div>
          <div className="components__wrapper">
            <div className="components__item">
              <Button>Button primary</Button>
            </div>
            <div className="components__item">
              <Button rounded>Button rounded</Button>
            </div>
            <div className="components__item">
              <Button disabled>Button disabled</Button>
            </div>
            <div className="components__item">
              <Button disabled isLoading>
                Button loading
              </Button>
            </div>
            <div className="components__item">
              <Button variant="destructive">Button destructive</Button>
            </div>
            <div className="components__item">
              <Button disabled isLoading variant="destructive">
                Button destructive
              </Button>
            </div>
            <div className="components__item">
              <Button variant="secondary">Button secondary</Button>
            </div>
            <div className="components__item">
              <Button color="primary" variant="secondary">
                Button primary secondary
              </Button>
            </div>
            <div className="components__item">
              <Button color="destructive" variant="secondary">
                Button destructive secondary
              </Button>
            </div>
            <div className="components__item">
              <Button variant="outline">Button outline</Button>
            </div>
            <div className="components__item">
              <Button color="primary" variant="outline">
                Button primary outline
              </Button>
            </div>
            <div className="components__item">
              <Button color="destructive" variant="outline">
                Button destructive outline
              </Button>
            </div>
            <div className="components__item">
              <Button variant="ghost">Button ghost</Button>
            </div>
            <div className="components__item">
              <Button variant="link">Button link</Button>
            </div>
            <div className="components__item">
              <Button color="success">Button success</Button>
            </div>
            <div className="components__item">
              <Button color="success" variant="secondary">
                Button success secondary
              </Button>
            </div>
            <div className="components__item">
              <Button color="success" variant="outline">
                Button success outline
              </Button>
            </div>
            <div className="components__item">
              <Button color="warning">Button warning</Button>
            </div>
            <div className="components__item">
              <Button color="warning" variant="secondary">
                Button warning secondary
              </Button>
            </div>
            <div className="components__item">
              <Button color="warning" variant="outline">
                Button warning outline
              </Button>
            </div>
            <div className="components__item">
              <Button animation={{ type: 'line', placement: 'hide' }} variant="link">
                Button line hide
              </Button>
            </div>
            <div className="components__item">
              <Button animation={{ type: 'line', placement: 'show' }} variant="link">
                Button line show
              </Button>
            </div>
            <div className="components__item">
              <Button animation={{ type: 'expandIcon', placement: 'left', icon: ArrowLeftIcon }}>Button expand icon left</Button>
            </div>
            <div className="components__item">
              <Button animation={{ type: 'expandIcon', placement: 'right', icon: ArrowRightIcon }}>Button expand icon right</Button>
            </div>
            <div className="components__item">
              <Button variant="outline">
                Messages
                <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border px-1 font-[inherit] text-[11px] font-medium text-muted-foreground">18</span>
              </Button>
            </div>
            <div className="components__item">
              <Button size="lg">Button lg</Button>
            </div>
            <div className="components__item">
              <Button size="sm">Button sm</Button>
            </div>
            <div className="components__item">
              <Button size="icon">
                <PlusIcon className="size-4" strokeWidth={2} />
              </Button>
            </div>
            <div className="components__item">
              <Button rounded aria-expanded={open['1']} className="group" size="icon" variant="outline" onClick={() => toggleSetOpen('1')}>
                <PlusIcon className="size-4 transition-transform group-aria-expanded:rotate-[135deg]" />
              </Button>
            </div>
            <div className="components__item">
              <Tooltip content="Tooltip">
                <Button size="icon" variant="outline">
                  <PlusIcon aria-hidden="true" className="size-4" />
                </Button>
              </Tooltip>
            </div>
            <div className="components__item">
              <Button aria-expanded={open['2']} className="group" size="icon" variant="outline" onClick={() => toggleSetOpen('2')}>
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="origin-center -translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    d="M4 12L20 12"
                  />
                  <path className="origin-center transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45" d="M4 12H20" />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </div>
            <div className="components__item">
              <Tooltip content="Click to copy">
                <Button size="icon" variant="outline" onClick={handleCopy}>
                  <div className={cn('transition-all', open['3'] ? 'scale-100 opacity-100' : 'scale-0 opacity-0')}>
                    <CheckIcon className="size-4 stroke-custom-green" />
                  </div>
                  <div className={cn('absolute transition-all', open['3'] ? 'scale-0 opacity-0' : 'scale-100 opacity-100')}>
                    <CopyIcon className="size-4" />
                  </div>
                </Button>
              </Tooltip>
            </div>
          </div>
        </DetailsSection>
      </ContentAdminLayout>
    </Helmet>
  );
});
