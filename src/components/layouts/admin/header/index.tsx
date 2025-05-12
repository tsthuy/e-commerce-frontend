import { memo } from 'react';

import { SheetMenu } from './sheet-menu';

export const HeaderAdminLayout = memo(() => {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-2 lg:space-x-0">
          <SheetMenu />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-3" />
      </div>
    </header>
  );
});
