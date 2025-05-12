import { memo, useCallback, useId, useState } from 'react';

import { BoltIcon, ChevronDownIcon, CopyPlusIcon, EllipsisIcon, FilesIcon, Layers2Icon, ListFilterIcon, TrashIcon } from 'lucide-react';

import { Button, DetailsSection, Helmet } from '~/components/common';
import { CustomCheckbox, CustomForm } from '~/components/form';
import { ContentAdminLayout } from '~/components/layouts/admin';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '~/components/ui';

const TIPS = [
  {
    title: 'Welcome to Dashboard',
    description: "This is your new workspace. Here you'll find all your projects, recent activities, settings, and more."
  },
  {
    title: 'Quick Actions',
    description: 'Use the toolbar above to create new projects, invite team members, or access settings.'
  },
  {
    title: 'Need Help?',
    description: 'Click the support icon in the top right corner to access our help center and documentation.'
  }
];

export const DropdownPopoverPage = memo(() => {
  const [checkbox, setCheckbox] = useState<{
    nextjs: boolean;
    sveltekit: boolean;
    astro: boolean;
    remix: boolean;
  }>({
    nextjs: false,
    sveltekit: false,
    astro: false,
    remix: false
  });
  const [radio, setRadio] = useState<string>('nextjs');
  const [currentTip, setCurrentTip] = useState<number>(0);

  const id = useId();

  const handleNavigation = useCallback((): void => {
    setCurrentTip((prev) => (prev === TIPS.length - 1 ? 0 : prev + 1));
  }, []);

  return (
    <Helmet title="Dropdown and Popover">
      <ContentAdminLayout breadcrumb={[{ label: 'Storybook' }, { label: 'Components' }, { label: 'Dropdown and Popover' }]}>
        <DetailsSection isHaveData>
          <div className="mb-10">
            <h2 className="mb-2 text-center text-xl font-bold">Dropdown and Popover</h2>
            <p className="text-center text-base text-muted-foreground">A growing collection of dropdown and popover components.</p>
          </div>
          <div className="components__wrapper">
            <div className="components__item">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-full" size="icon" variant="ghost">
                    <EllipsisIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Option 1</DropdownMenuItem>
                  <DropdownMenuItem>Option 2</DropdownMenuItem>
                  <DropdownMenuItem>Option 3</DropdownMenuItem>
                  <DropdownMenuItem>Option 4</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="components__item">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Same width of trigger
                    <ChevronDownIcon className="-me-1 ms-2 size-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[--radix-dropdown-menu-trigger-width]">
                  <DropdownMenuItem>Option 1</DropdownMenuItem>
                  <DropdownMenuItem>Option 2</DropdownMenuItem>
                  <DropdownMenuItem>Option 3</DropdownMenuItem>
                  <DropdownMenuItem>Option 4</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="components__item">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Menu with icons
                    <ChevronDownIcon className="-me-1 ms-2 size-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="gap-x-2">
                    <CopyPlusIcon className="size-4 opacity-60" />
                    Copy
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-x-2">
                    <BoltIcon className="size-4 opacity-60" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-x-2">
                    <Layers2Icon className="size-4 opacity-60" />
                    Group
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-x-2">
                    <FilesIcon className="size-4 opacity-60" />
                    Clone
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="components__item">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Grouped items
                    <ChevronDownIcon className="-me-1 ms-2 size-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="gap-x-2">
                      <CopyPlusIcon className="size-4 opacity-60" />
                      Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-x-2">
                      <BoltIcon className="size-4 opacity-60" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="gap-x-2">
                      <Layers2Icon className="size-4 opacity-60" />
                      Group
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-x-2">
                      <FilesIcon className="size-4 opacity-60" />
                      Clone
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-x-2 text-destructive focus:text-destructive">
                      <TrashIcon className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="components__item">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Labeled grouped items
                    <ChevronDownIcon className="-me-1 ms-2 size-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Label</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="gap-x-2">
                      <CopyPlusIcon className="size-4 opacity-60" />
                      Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-x-2">
                      <BoltIcon className="size-4 opacity-60" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Label</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="gap-x-2">
                      <Layers2Icon className="size-4 opacity-60" />
                      Group
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-x-2">
                      <FilesIcon className="size-4 opacity-60" />
                      Clone
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-x-2 text-destructive focus:text-destructive">
                      <TrashIcon className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="components__item">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Checkbox items
                    <ChevronDownIcon className="-me-1 ms-2 size-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuCheckboxItem checked={checkbox.nextjs} onCheckedChange={(value) => setCheckbox((prev) => ({ ...prev, nextjs: value }))}>
                    Next.js
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={checkbox.sveltekit} onCheckedChange={(value) => setCheckbox((prev) => ({ ...prev, sveltekit: value }))}>
                    SvelteKit
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem disabled checked={checkbox.remix} onCheckedChange={(value) => setCheckbox((prev) => ({ ...prev, remix: value }))}>
                    Remix
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={checkbox.astro} onCheckedChange={(value) => setCheckbox((prev) => ({ ...prev, astro: value }))}>
                    Astro
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="components__item">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Radio items
                    <ChevronDownIcon className="-me-1 ms-2 size-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={radio} onValueChange={setRadio}>
                    <DropdownMenuRadioItem value="nextjs">Next.js</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem disabled value="sveltekit">
                      SvelteKit
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="remix">Remix</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="astro">Astro</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="components__item">
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="outline">
                    <ListFilterIcon className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-36 p-3">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">Filters</div>
                    <CustomForm className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CustomCheckbox classNameLabel="font-normal" label="Real Time" name={`${id}-1`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <CustomCheckbox classNameLabel="font-normal" label="Top Channels" name={`${id}-2`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <CustomCheckbox classNameLabel="font-normal" label="Last Orders" name={`${id}-3`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <CustomCheckbox classNameLabel="font-normal" label="Total Spent" name={`${id}-4`} />
                      </div>
                      <div aria-orientation="horizontal" className="-mx-3 my-1 h-px bg-border" role="separator"></div>
                      <div className="flex justify-between gap-2">
                        <Button className="h-7 px-2" size="sm" type="reset" variant="outline">
                          Clear
                        </Button>
                        <Button className="h-7 px-2" size="sm" type="submit">
                          Apply
                        </Button>
                      </div>
                    </CustomForm>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="components__item">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Tooltip-like popover</Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-[280px] py-3 shadow-none" side="top">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-[13px] font-medium">Popover with button</p>
                      <p className="text-xs text-muted-foreground">I am a popover that would like to look like a tooltip. I can&lsquo;t be a tooltip because of the interactive element inside me.</p>
                    </div>
                    <Button className="h-7 px-2" size="sm">
                      Know more
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="components__item">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Tooltip-like with steps</Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-[280px] py-3 shadow-none" side="top">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-[13px] font-medium">{TIPS[currentTip].title}</p>
                      <p className="text-xs text-muted-foreground">{TIPS[currentTip].description}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        {currentTip + 1}/{TIPS.length}
                      </span>
                      <button className="text-xs font-medium hover:underline" onClick={handleNavigation}>
                        {currentTip === TIPS.length - 1 ? 'Start over' : 'Next'}
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </DetailsSection>
      </ContentAdminLayout>
    </Helmet>
  );
});
