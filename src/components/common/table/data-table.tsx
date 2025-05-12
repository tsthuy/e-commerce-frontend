import type { HTMLAttributes, ReactNode } from 'react';

import type { Column, Table as TanstackTable } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { ChevronDownIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronsUpDownIcon, ChevronUpIcon, EllipsisIcon } from 'lucide-react';

import { TABLE_LIMIT_DEFAULT, TABLE_VIEW_OPTIONS_DEFAULT } from '~/constants';

import { cn, getCommonPinningStyles } from '~/libs';

import { renderPagination } from '~/utils';

import { CustomForm, CustomSelect } from '~/components/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui';

import { Button } from '../button';
import { CustomSkeleton } from '../skeleton';
import { Tooltip } from '../tooltip';

interface DataTableProps<TData> extends HTMLAttributes<HTMLDivElement> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>;

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar table={table} />}
   */
  floatingBar?: ReactNode | null;
  isLoading?: boolean;
  isHiddenSelectedRowCount?: boolean;
  isHiddenPagination?: boolean;
  classNameHeader?: string;
}
interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>;
  pageSizeOptions?: number[];
  isHiddenSelectedRowCount?: boolean;
}
interface DataTableColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTable<TData>({
  table,
  floatingBar = null,
  children,
  className,
  isLoading,
  isHiddenSelectedRowCount,
  isHiddenPagination,
  classNameHeader,
  ...props
}: DataTableProps<TData>): React.JSX.Element {
  return (
    <div className={cn('w-full space-y-2.5 overflow-auto', className)} {...props}>
      {children}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn('bg-black text-white dark:bg-white dark:text-black', classNameHeader)}
                      colSpan={header.colSpan}
                      style={{
                        ...getCommonPinningStyles({ column: header.column })
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...new Array(TABLE_LIMIT_DEFAULT)].map((_, indexRow) => (
                <TableRow key={indexRow}>
                  {table.getAllColumns().map((_, indexCol) => (
                    <TableCell key={indexCol}>
                      <CustomSkeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column })
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={table.getAllColumns().length}>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isHiddenPagination && (
        <div className="flex flex-col gap-2.5">
          <DataTablePagination isHiddenSelectedRowCount={isHiddenSelectedRowCount} table={table} />
          {table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
        </div>
      )}
    </div>
  );
}

function DataTablePagination<TData>({ table, pageSizeOptions = TABLE_VIEW_OPTIONS_DEFAULT, isHiddenSelectedRowCount }: DataTablePaginationProps<TData>): React.JSX.Element {
  const paginationArr = renderPagination(table.getState().pagination.pageIndex + 1, table.getPageCount());

  return (
    <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 md:flex-row md:gap-8">
      <div className="flex items-center space-x-2">
        {!isHiddenSelectedRowCount && (
          <div className="flex whitespace-nowrap text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        )}
        <p className="whitespace-nowrap text-sm font-medium">Show</p>
        <CustomForm>
          <CustomSelect
            classNameInput="h-8 py-1 w-[75px]"
            handleOnChangeValue={(value) => table.setPageSize(Number(value))}
            name="rows-per-page"
            options={pageSizeOptions.map((item) => ({ value: String(item), label: String(item) }))}
            value={String(table.getState().pagination.pageSize)}
          />
        </CustomForm>
        <p className="whitespace-nowrap text-sm font-medium">items per page</p>
      </div>
      <div className="flex items-center justify-center text-sm font-medium">
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </div>
      <div className="flex items-center space-x-2">
        <Tooltip content="Go to first page">
          <Button className="hidden size-8 p-0 lg:flex" disabled={!table.getCanPreviousPage()} size="icon" variant="outline" onClick={() => table.setPageIndex(0)}>
            <ChevronsLeft className="size-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Go to previous page">
          <Button className="hidden size-8 p-0 lg:flex" disabled={!table.getCanPreviousPage()} size="icon" variant="outline" onClick={() => table.previousPage()}>
            <ChevronLeft className="size-4" />
          </Button>
        </Tooltip>
        {paginationArr.map((page, index) =>
          page !== null ? (
            <Button
              key={index}
              className="h-8 w-fit min-w-8 px-1"
              disabled={table.getState().pagination.pageIndex + 1 === page}
              size="icon"
              variant="outline"
              onClick={() => table.setPageIndex(page - 1)}
            >
              {page}
            </Button>
          ) : (
            <Button key={index} disabled className="size-8 p-0" size="icon" variant="outline">
              <EllipsisIcon className="size-4" />
            </Button>
          )
        )}
        <Tooltip content="Go to next page">
          <Button className="hidden size-8 p-0 lg:flex" disabled={!table.getCanNextPage()} size="icon" variant="outline" onClick={() => table.nextPage()}>
            <ChevronRight className="size-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Go to last page">
          <Button className="hidden size-8 p-0 lg:flex" disabled={!table.getCanNextPage()} size="icon" variant="outline" onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
            <ChevronsRight className="size-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export function DataTableColumnHeader<TData, TValue>({ column, title, className }: DataTableColumnHeaderProps<TData, TValue>): React.JSX.Element {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Tooltip content={column.getIsSorted() === 'desc' ? 'Reset' : column.getIsSorted() === 'asc' ? 'Desc' : 'Asc'}>
        <Button
          className="-ml-3"
          size="sm"
          variant="ghost"
          onClick={() => {
            if (column.getCanSort()) {
              if (column.getIsSorted() === 'asc') {
                column.toggleSorting(true);
              } else if (column.getIsSorted() === 'desc') {
                column.clearSorting();
              } else {
                column.toggleSorting(false);
              }
            }
          }}
        >
          <span>{title}</span>
          {column.getCanSort() && column.getIsSorted() === 'desc' ? (
            <ChevronDownIcon className="ml-2 size-4" />
          ) : column.getIsSorted() === 'asc' ? (
            <ChevronUpIcon className="ml-2 size-4" />
          ) : (
            <ChevronsUpDownIcon className="ml-2 size-4" />
          )}
        </Button>
      </Tooltip>
    </div>
  );
}
