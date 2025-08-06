/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { memo, useMemo, useState } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Trash2 } from 'lucide-react';

import { useDataTable } from '~/hooks';

import { AdminCustomerDetailDialog } from '~/components/admin/admin-customer-detail-dialog';
import { DataTable, DataTableColumnHeader, DataTableToolbar } from '~/components/common/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '~/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

import { useAdminCustomerList, useDeleteAdminCustomer } from '~/hooks/use-admin-customer.hook';
import type { AdminCustomerResponse } from '~/types/admin-customer';

export const AdminCustomersTable = memo(() => {
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomerResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<AdminCustomerResponse | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteCustomerMutation = useDeleteAdminCustomer();

  const handleViewDetail = (customer: AdminCustomerResponse): void => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (customer: AdminCustomerResponse): void => {
    setCustomerToDelete(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (customerToDelete) {
      try {
        await deleteCustomerMutation.mutateAsync(customerToDelete.id);
        setIsDeleteDialogOpen(false);
        setCustomerToDelete(null);
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleDeleteCancel = (): void => {
    setIsDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  const columns: ColumnDef<AdminCustomerResponse>[] = [
    {
      accessorKey: 'avatar',
      header: 'Avatar',
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <Avatar className="h-14 w-14 !rounded-lg">
            <AvatarImage alt={customer.fullName} src={customer.avatar?.url} />
            <AvatarFallback>
              {customer.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        );
      },
      enableSorting: false
    },
    {
      accessorKey: 'fullName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Full Name" />,
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div>
            <div className="font-medium">{customer.fullName}</div>
            <div className="text-sm text-muted-foreground">{customer.email}</div>
          </div>
        );
      }
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
      cell: ({ row }) => {
        const phone = row.getValue('phone') as string;
        return phone || '-';
      }
    },
    {
      accessorKey: 'createdViaOAuth',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Account Type" />,
      cell: ({ row }) => {
        const isOAuth = row.getValue('createdViaOAuth') as boolean;
        return <Badge variant={isOAuth ? 'default' : 'secondary'}>{isOAuth ? 'OAuth' : 'Local'}</Badge>;
      }
    },
    {
      accessorKey: 'totalOrders',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total Orders" />,
      cell: ({ row }) => {
        const totalOrders = row.getValue('totalOrders') as number | null;
        return <span className="font-medium">{totalOrders || 0}</span>;
      }
    },
    {
      accessorKey: 'totalSpent',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total Spent" />,
      cell: ({ row }) => {
        const totalSpent = row.getValue('totalSpent') as number | null;
        return <span className="font-medium">${(totalSpent || 0).toFixed(2)}</span>;
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Joined Date" />,
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string | null;
        return date ? new Date(date).toLocaleDateString() : '-';
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }): JSX.Element => {
        const customer = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => handleViewDetail(customer)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(customer)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
      enableSorting: false
    }
  ];

  const filterFields = useMemo(
    () => [
      {
        label: 'Search Customers',
        value: 'fullName' as keyof AdminCustomerResponse,
        placeholder: 'Search by name, email, phone...'
      }
    ],
    []
  );

  // Initialize table with empty data first
  const { table } = useDataTable({
    data: [],
    columns,
    pageCount: 0,
    filterFields,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }]
    }
  });

  // Get current table state for API call
  const pagination = table.getState().pagination;
  const sorting = table.getState().sorting;
  const columnFilters = table.getState().columnFilters;

  // Build query parameters from table state
  const queryParams = useMemo(() => {
    const searchFilter = columnFilters.find((filter) => filter.id === 'fullName');
    const sortConfig = sorting[0];

    const params: Record<string, string | number> = {
      page: pagination.pageIndex,
      size: pagination.pageSize
    };

    if (sortConfig) {
      params.sortBy = sortConfig.id;
      params.sortDirection = sortConfig.desc ? 'desc' : 'asc';
    }

    // Only search by text (fullName, email, phone)
    if (searchFilter?.value) {
      params.search = String(searchFilter.value);
    }

    return params;
  }, [pagination, sorting, columnFilters]);

  const { data: customersData, isLoading } = useAdminCustomerList({
    data: queryParams
  });

  const customers = customersData?.result?.content || [];
  const pageCount = customersData?.result?.totalPages || 0;

  // Update table options with fetched data
  table.options.data = customers;
  table.options.pageCount = pageCount;

  return (
    <div className="space-y-4">
      <DataTable classNameHeader="bg-primary text-primary-foreground hover:bg-primary/80 dark:bg-primary dark:text-primary-foreground" isLoading={isLoading} table={table}>
        <DataTableToolbar filterFields={filterFields} table={table} />
      </DataTable>

      <AdminCustomerDetailDialog customer={selectedCustomer} open={isDetailOpen} onOpenChange={setIsDetailOpen} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the customer account for <strong>{customerToDelete?.fullName}</strong> ({customerToDelete?.email}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCustomerMutation.isPending} onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteCustomerMutation.isPending} onClick={handleDeleteConfirm}>
              {deleteCustomerMutation.isPending ? 'Deleting...' : 'Delete Customer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});

AdminCustomersTable.displayName = 'AdminCustomersTable';
