/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { memo, useMemo, useState } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import { useDataTable } from '~/hooks';

import { AdminSellerDetailDialog } from '~/components/admin/admin-seller-detail-dialog';
import { DataTable, DataTableColumnHeader, DataTableToolbar } from '~/components/common/table';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

import { useAdminSellerList } from '~/hooks/use-admin-seller.hook';
import type { AdminSellerResponse } from '~/types/admin-seller';

export const AdminSellersTable = memo(() => {
  const [selectedSeller, setSelectedSeller] = useState<AdminSellerResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetail = (seller: AdminSellerResponse) => {
    setSelectedSeller(seller);
    setIsDetailOpen(true);
  };

  const columns: ColumnDef<AdminSellerResponse>[] = [
    {
      accessorKey: 'avatar',
      header: 'Avatar',
      cell: ({ row }) => {
        const seller = row.original;
        return (
          <Avatar className="h-10 w-10">
            <AvatarImage alt={seller.shopName} src={seller.avatar?.url} />
            <AvatarFallback>
              {seller.shopName
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
      accessorKey: 'shopName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Shop Name" />,
      cell: ({ row }) => {
        const seller = row.original;
        return (
          <div>
            <div className="font-medium">{seller.shopName}</div>
            <div className="text-sm text-muted-foreground">{seller.email}</div>
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
      accessorKey: 'totalProducts',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total Products" />,
      cell: ({ row }) => {
        const totalProducts = row.getValue('totalProducts') as number | null;
        return <span className="font-medium">{totalProducts || 0}</span>;
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
      accessorKey: 'availableAmount',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Available Amount" />,
      cell: ({ row }) => {
        const availableAmount = row.getValue('availableAmount') as number | null;
        return <span className="font-medium">${(availableAmount || 0).toFixed(2)}</span>;
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
      cell: ({ row }) => {
        const seller = row.original;
        return (
          <Button size="sm" variant="ghost" onClick={() => handleViewDetail(seller)}>
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
        label: 'Search Sellers',
        value: 'shopName' as keyof AdminSellerResponse,
        placeholder: 'Search by shop name, email, phone...'
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
    const searchFilter = columnFilters.find((filter) => filter.id === 'shopName');
    const sortConfig = sorting[0];

    const params: Record<string, string | number> = {
      page: pagination.pageIndex,
      size: pagination.pageSize
    };

    if (sortConfig) {
      params.sortBy = sortConfig.id;
      params.sortDirection = sortConfig.desc ? 'desc' : 'asc';
    }

    // Only search by text (shopName, email, phone)
    if (searchFilter?.value) {
      params.search = String(searchFilter.value);
    }

    return params;
  }, [pagination, sorting, columnFilters]);

  const { data: sellersData, isLoading } = useAdminSellerList({
    data: queryParams
  });

  const sellers = sellersData?.result?.content || [];
  const pageCount = sellersData?.result?.totalPages || 0;

  // Update table options with fetched data
  table.options.data = sellers;
  table.options.pageCount = pageCount;

  return (
    <div className="space-y-4">
      <DataTable isLoading={isLoading} table={table}>
        <DataTableToolbar filterFields={filterFields} table={table} />
      </DataTable>

      <AdminSellerDetailDialog open={isDetailOpen} seller={selectedSeller} onOpenChange={setIsDetailOpen} />
    </div>
  );
});

AdminSellersTable.displayName = 'AdminSellersTable';
