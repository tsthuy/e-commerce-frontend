import type { Column } from '@tanstack/react-table';
import { Check, PlusCircle } from 'lucide-react';

import { cn } from '~/libs';

import { Badge, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, Popover, PopoverContent, PopoverTrigger, Separator } from '~/components/ui';

import { Button } from '../button';

import type { OptionTableFilter } from '~/types/table';

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: OptionTableFilter[];
}

export function DataTableFacetedFilter<TData, TValue>({ column, title, options }: DataTableFacetedFilterProps<TData, TValue>): React.JSX.Element {
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button className="h-8 border-dashed" size="sm" variant="outline">
          <PlusCircle className="mr-2 size-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator className="mx-2 h-4" orientation="vertical" />
              <Badge className="rounded-sm px-1 font-normal lg:hidden" variant="secondary">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge className="rounded-sm px-1 font-normal" variant="secondary">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge key={option.value} className="rounded-sm px-1 font-normal" variant="secondary">
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[12.5rem] p-0">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    className="cursor-pointer"
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(filterValues.length ? filterValues : undefined);
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check aria-hidden="true" className="size-4" />
                    </div>
                    <span>{option.label}</span>
                    {option.withCount && column?.getFacetedUniqueValues()?.get(option.value) && (
                      <span className="ml-auto flex size-4 items-center justify-center text-xs">{column?.getFacetedUniqueValues().get(option.value)}</span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem className="cursor-pointer justify-center text-center" onSelect={() => column?.setFilterValue(undefined)}>
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
