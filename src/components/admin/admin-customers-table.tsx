/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { memo, useMemo, useState } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import { useDataTable } from '~/hooks';

import { AdminCustomerDetailDialog } from '~/components/admin/admin-customer-detail-dialog';
import { DataTable, DataTableColumnHeader, DataTableToolbar } from '~/components/common/table';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

import { useAdminCustomerList } from '~/hooks/use-admin-customer.hook';
import type { AdminCustomerResponse } from '~/types/admin-customer';

export const AdminCustomersTable = memo(() => {
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomerResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetail = (customer: AdminCustomerResponse) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const columns: ColumnDef<AdminCustomerResponse>[] = [
    {
      accessorKey: 'avatar',
      header: 'Avatar',
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <Avatar className="h-10 w-10">
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
        const totalOrders = row.getValue('totalOrders') as number;
        return <span className="font-medium">{totalOrders}</span>;
      }
    },
    {
      accessorKey: 'totalSpent',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total Spent" />,
      cell: ({ row }) => {
        const totalSpent = row.getValue('totalSpent') as number;
        return <span className="font-medium">${totalSpent.toFixed(2)}</span>;
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Joined Date" />,
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return new Date(date).toLocaleDateString();
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <Button size="sm" variant="ghost" onClick={() => handleViewDetail(customer)}>
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
      enableSorting: false
    }
  ];

  const filterFields = useMemo(
    () => [
      {
        label: 'Search Customers',
        value: 'search' as keyof AdminCustomerResponse,
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
    const searchFilter = columnFilters.find((filter) => filter.id === 'search');
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
      <DataTable isLoading={isLoading} table={table}>
        <DataTableToolbar filterFields={filterFields} table={table} />
      </DataTable>

      <AdminCustomerDetailDialog customer={selectedCustomer} open={isDetailOpen} onOpenChange={setIsDetailOpen} />
    </div>
  );
});

AdminCustomersTable.displayName = 'AdminCustomersTable';
