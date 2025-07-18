import { memo, useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';

import type { CategoryResponse } from '~/types';

import { useCategoryDelete, useCategoryList, useDataTable } from '~/hooks';

import { DataTable, DataTableColumnHeader, DataTableToolbar, TasksTableToolbarActions } from '~/components/common/table';
import { Button } from '~/components/ui';

interface CategoriesTableProps {
  onEdit?: (category: CategoryResponse) => void;
  onCreate?: () => void;
}

export const CategoriesTable = memo<CategoriesTableProps>(({ onEdit, onCreate }) => {
  const deleteMutation = useCategoryDelete();

  // Define table columns
  const columns: ColumnDef<CategoryResponse>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input checked={table.getIsAllPageRowsSelected()} className="rounded border border-gray-300" type="checkbox" onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)} />
        ),
        cell: ({ row }) => <input checked={row.getIsSelected()} className="rounded border border-gray-300" type="checkbox" onChange={(e) => row.toggleSelected(e.target.checked)} />,
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.getValue('name')}</div>
            {row.original.slug && <div className="text-sm text-muted-foreground">{row.original.slug}</div>}
          </div>
        ),
        enableSorting: true,
        enableHiding: false
      },
      {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
        cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue('description') || '-'}</div>,
        enableSorting: false,
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
        cell: ({ row }): JSX.Element => {
          const date = new Date(row.getValue('createdAt'));
          return <div className="text-sm">{date.toLocaleDateString()}</div>;
        },
        enableSorting: true,
        enableHiding: true
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit?.(row.original)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button className="text-red-600 hover:text-red-700" disabled={deleteMutation.isPending} size="sm" variant="outline" onClick={() => deleteMutation.mutate(row.original.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false
      }
    ],
    [onEdit, deleteMutation]
  );

  // Filter fields for search and filtering
  const filterFields = useMemo(
    () => [
      {
        label: 'Search categories',
        value: 'name' as keyof CategoryResponse,
        placeholder: 'Search by name...'
      }
    ],
    []
  );

  // Initialize table with empty data first to get state
  const { table } = useDataTable({
    data: [],
    columns,
    pageCount: 0,
    filterFields,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] }
    }
  });

  // Get current table state for API call
  const pagination = table.getState().pagination;
  const sorting = table.getState().sorting;
  const columnFilters = table.getState().columnFilters;

  // Build query parameters from table state
  const queryParams = useMemo(() => {
    const searchFilter = columnFilters.find((filter) => filter.id === 'name');
    const sortConfig = sorting[0];

    const params: Record<string, string | number> = {
      page: pagination.pageIndex,
      size: pagination.pageSize
    };

    if (sortConfig) {
      params.sortBy = sortConfig.id;
      params.sortDirection = sortConfig.desc ? 'desc' : 'asc';
    }

    if (searchFilter?.value) {
      params.search = String(searchFilter.value);
    }

    return params;
  }, [pagination, sorting, columnFilters]);

  // Fetch data with dynamic parameters
  const { data: categoriesResponse, isLoading } = useCategoryList({
    data: queryParams
  });

  const categories = categoriesResponse?.result?.content || [];
  const pageCount = categoriesResponse?.result?.totalPages || 0;

  // Update table options with fetched data
  table.options.data = categories;
  table.options.pageCount = pageCount;

  const handleBulkDelete = (): void => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);

    selectedIds.forEach((id) => {
      deleteMutation.mutate(id);
    });

    // Clear selection after delete
    table.resetRowSelection();
  };

  return (
    <DataTable classNameHeader="bg-primary text-primary-foreground hover:bg-primary/80 dark:bg-primary dark:text-primary-foreground" isLoading={isLoading} table={table}>
      <DataTableToolbar filterFields={filterFields} table={table}>
        <TasksTableToolbarActions
          table={table}
          createAction={{
            label: 'Add Category',
            action: () => onCreate?.()
          }}
          deleteAction={{
            label: 'Delete',
            action: handleBulkDelete
          }}
        />
      </DataTableToolbar>
    </DataTable>
  );
});

CategoriesTable.displayName = 'CategoriesTable';
