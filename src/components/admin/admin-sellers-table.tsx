/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { memo, useMemo, useState } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useDataTable } from '~/hooks';

import { AdminSellerDetailDialog } from '~/components/admin/admin-seller-detail-dialog';
import { DataTable, DataTableColumnHeader, DataTableToolbar } from '~/components/common/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '~/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

import { useAdminSellerList, useDeleteAdminSeller } from '~/hooks/use-admin-seller.hook';
import type { AdminSellerResponse } from '~/types/admin-seller';

export const AdminSellersTable = memo(() => {
  const { t } = useTranslation();
  const [selectedSeller, setSelectedSeller] = useState<AdminSellerResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState<AdminSellerResponse | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteSellerMutation = useDeleteAdminSeller();

  const handleViewDetail = (seller: AdminSellerResponse) => {
    setSelectedSeller(seller);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (seller: AdminSellerResponse): void => {
    setSellerToDelete(seller);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (sellerToDelete) {
      try {
        await deleteSellerMutation.mutateAsync(sellerToDelete.id);
        setIsDeleteDialogOpen(false);
        setSellerToDelete(null);
      } catch (error) {
        console.error('Error deleting seller:', error);
      }
    }
  };

  const handleDeleteCancel = (): void => {
    setIsDeleteDialogOpen(false);
    setSellerToDelete(null);
  };

  const columns: ColumnDef<AdminSellerResponse>[] = [
    {
      accessorKey: 'avatar',
      header: t('Admin.sellers.avatar'),
      cell: ({ row }) => {
        const seller = row.original;
        return (
          <Avatar className="h-14 w-14 !rounded-lg">
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
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('Admin.sellers.shopName')} />,
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
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('Admin.sellers.phone')} />,
      cell: ({ row }) => {
        const phone = row.getValue('phone') as string;
        return phone || '-';
      }
    },
    {
      accessorKey: 'createdViaOAuth',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('Admin.sellers.accountType')} />,
      cell: ({ row }) => {
        const isOAuth = row.getValue('createdViaOAuth') as boolean;
        return <Badge variant={isOAuth ? 'default' : 'secondary'}>{isOAuth ? t('Admin.sellers.oauth') : t('Admin.sellers.local')}</Badge>;
      }
    },
    {
      accessorKey: 'totalProducts',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('Admin.sellers.totalProducts')} />,
      cell: ({ row }) => {
        const totalProducts = row.getValue('totalProducts') as number | null;
        return <span className="font-medium">{totalProducts || 0}</span>;
      }
    },
    {
      accessorKey: 'totalOrders',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('Admin.sellers.totalOrders')} />,
      cell: ({ row }) => {
        const totalOrders = row.getValue('totalOrders') as number | null;
        return <span className="font-medium">{totalOrders || 0}</span>;
      }
    },
    {
      accessorKey: 'availableAmount',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('Admin.sellers.availableAmount')} />,
      cell: ({ row }) => {
        const availableAmount = row.getValue('availableAmount') as number | null;
        return <span className="font-medium">${(availableAmount || 0).toFixed(2)}</span>;
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('Admin.sellers.joinedDate')} />,
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string | null;
        return date ? new Date(date).toLocaleDateString() : '-';
      }
    },
    {
      id: 'actions',
      header: t('Admin.sellers.actions'),
      cell: ({ row }): JSX.Element => {
        const seller = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => handleViewDetail(seller)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(seller)}>
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
        label: t('Admin.sellers.searchSellers'),
        value: 'shopName' as keyof AdminSellerResponse,
        placeholder: t('Admin.sellers.searchByShopNameEmail')
      }
    ],
    [t]
  );
  const { table } = useDataTable({
    data: [],
    columns,
    pageCount: 0,
    filterFields,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }]
    }
  });
  const pagination = table.getState().pagination;
  const sorting = table.getState().sorting;
  const columnFilters = table.getState().columnFilters;

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

  table.options.data = sellers;
  table.options.pageCount = pageCount;

  return (
    <div className="space-y-4">
      <DataTable classNameHeader="bg-primary text-primary-foreground hover:bg-primary/80 dark:bg-primary dark:text-primary-foreground" isLoading={isLoading} table={table}>
        <DataTableToolbar filterFields={filterFields} table={table} />
      </DataTable>

      <AdminSellerDetailDialog open={isDetailOpen} seller={selectedSeller} onOpenChange={setIsDetailOpen} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Admin.sellers.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Admin.sellers.deleteConfirmDescription')} <strong>{sellerToDelete?.shopName}</strong> ({sellerToDelete?.email}). {t('Admin.sellers.deleteConfirmDescriptionSuffix')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSellerMutation.isPending} onClick={handleDeleteCancel}>
              {t('Admin.sellers.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteSellerMutation.isPending} onClick={handleDeleteConfirm}>
              {deleteSellerMutation.isPending ? t('Admin.sellers.deleting') : t('Admin.sellers.deleteSeller')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});

AdminSellersTable.displayName = 'AdminSellersTable';
