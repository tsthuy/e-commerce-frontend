import type { Table } from '@tanstack/react-table';
import type { LucideIcon } from 'lucide-react';
import { PlusIcon, Trash2Icon } from 'lucide-react';

import type { ButtonProps } from '~/components/ui';

import { Button } from '../button';

interface TasksTableToolbarActionsProps<TData> {
  table: Table<TData>;
  createAction?: {
    label?: string;
    icon?: LucideIcon;
    action: () => void;
  };
  deleteAction?: {
    label?: string;
    icon?: LucideIcon;
    action: () => void;
  };
  customActions?: Array<{
    label: string;
    icon?: LucideIcon;
    variant?: ButtonProps['variant'];
    action: () => void;
  }>;
  extraActions?: Array<{
    label: string;
    icon?: LucideIcon;
    variant?: ButtonProps['variant'];
    action: () => void;
    color?: 'primary' | 'destructive' | 'success' | 'warning';
    isLoading?: boolean;
  }>;
}

export function TasksTableToolbarActions<TData>({ table, createAction, deleteAction, customActions, extraActions }: TasksTableToolbarActionsProps<TData>): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      {!!extraActions &&
        extraActions.map(({ label, action, icon, variant = 'default', color, isLoading }, index) => (
          <Button
            key={index}
            animation={!!icon ? { type: 'expandIcon', icon: icon, placement: 'left' } : undefined}
            className="h-8"
            color={color}
            disabled={isLoading}
            isLoading={isLoading}
            size="sm"
            variant={variant}
            onClick={action}
          >
            {label}
          </Button>
        ))}
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <>
          {!!customActions &&
            customActions.map(({ label, action, icon, variant = 'default' }, index) => (
              <Button key={index} animation={!!icon ? { type: 'expandIcon', icon: icon, placement: 'left' } : undefined} className="h-8" size="sm" variant={variant} onClick={action}>
                {label} ({table.getFilteredSelectedRowModel().rows.map((row) => row.original).length})
              </Button>
            ))}
          {!!deleteAction && (
            <Button animation={{ type: 'expandIcon', icon: deleteAction.icon ?? Trash2Icon, placement: 'left' }} className="h-8" size="sm" variant="destructive" onClick={deleteAction.action}>
              {deleteAction.label ?? 'Delete'} ({table.getFilteredSelectedRowModel().rows.map((row) => row.original).length})
            </Button>
          )}
        </>
      )}
      {!!createAction && (
        <Button animation={{ type: 'expandIcon', icon: createAction.icon ?? PlusIcon, placement: 'left' }} className="h-8" size="sm" onClick={createAction.action}>
          {createAction.label ?? 'New'}
        </Button>
      )}
    </div>
  );
}
