import { memo, useMemo } from 'react';

import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { z } from 'zod';

import { Button } from '~/components/common';
import { CustomForm, CustomInputSearch } from '~/components/form';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui';

export const HeaderPublicLayout = memo(() => {
  return (
    <header className="h-header-public bg-primary">
      <div className="mx-auto flex size-full max-w-[calc(1280px+4px*4*2)] items-center justify-between gap-x-10 px-4">
        <div className="flex flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex min-w-64 justify-between rounded-md bg-white px-2 py-2">
              <Menu />
              All Categories <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-64">
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden flex-grow items-center gap-x-6 md:flex">
          <SearchBar />
        </div>
        {/* <div className="flex-grow"></div> */}
        <div className="flex flex-shrink-0 items-center justify-end gap-x-5">
          <Button className="min-w-[120px]" color="primary" size="sm" variant="default">
            Become Seller <ChevronRight />
          </Button>
        </div>
      </div>
    </header>
  );
});

export const SearchBar = memo(() => {
  const schema = useMemo(() => z.object({ searchTerm: z.string().optional() }), []);

  const defaultValues = useMemo(() => ({ searchTerm: '' }), []);

  const handleSearch = async (values: string): Promise<void> => {
    console.log(values);
  };

  return (
    <CustomForm className="w-full" options={{ defaultValues }} schema={schema}>
      <CustomInputSearch className="w-full" handleOnChange={(e) => handleSearch(e.target.value)} name="searchTerm" placeholder="Search products..." />
    </CustomForm>
  );
});
