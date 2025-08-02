import { AdminSellersTable } from '~/components/admin/admin-sellers-table';

export const AdminSellersPage = (): JSX.Element => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sellers Management</h1>
          <p className="text-muted-foreground">Manage and view all sellers in your platform</p>
        </div>
      </div>

      <AdminSellersTable />
    </div>
  );
};
