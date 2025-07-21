import { useState } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import { DataTable } from '@/components/common/table/DataTable';
import { ProductDetailDialog } from '@/components/product/ProductDetailDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/Product';
import { formatPrice } from '@/utils/format';

interface AdminProductsTableProps {
  products: Product[];
  isLoading?: boolean;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  pageCount?: number;
  onPaginationChange?: (updater: any) => void;
}

export function AdminProductsTable({ products, isLoading, pagination, pageCount, onPaginationChange }: AdminProductsTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailDialogOpen(true);
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <span className="font-mono text-sm">{row.getValue('id')}</span>
    },
    {
      accessorKey: 'name',
      header: 'Product Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          {row.original.images && row.original.images.length > 0 && <img alt={row.getValue('name')} className="h-10 w-10 rounded-md object-cover" src={row.original.images[0].url} />}
          <div>
            <div className="font-medium text-foreground">{row.getValue('name')}</div>
            <div className="text-sm text-muted-foreground">{row.original.category?.name}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'seller',
      header: 'Seller',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.seller?.businessName || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">{row.original.seller?.user?.email || 'N/A'}</div>
        </div>
      )
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => <span className="font-medium">{formatPrice(row.getValue('price'))}</span>
    },
    {
      accessorKey: 'totalSold',
      header: 'Sold',
      cell: ({ row }) => <span className="text-sm">{row.getValue('totalSold') || 0}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return <Badge variant={status === 'ACTIVE' ? 'default' : status === 'INACTIVE' ? 'secondary' : status === 'PENDING' ? 'outline' : 'destructive'}>{status}</Badge>;
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{new Date(row.getValue('createdAt')).toLocaleDateString()}</span>
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button className="h-8 w-8 p-0" size="sm" variant="ghost" onClick={() => handleViewDetails(row.original)}>
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <>
      <DataTable columns={columns} data={products} isLoading={isLoading} pageCount={pageCount} pagination={pagination} onPaginationChange={onPaginationChange} />

      {selectedProduct && <ProductDetailDialog isAdmin open={isDetailDialogOpen} product={selectedProduct} onOpenChange={setIsDetailDialogOpen} />}
    </>
  );
}
