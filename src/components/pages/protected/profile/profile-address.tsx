import { memo, useCallback, useState } from 'react';

import { Trash } from 'lucide-react';
import { toast } from 'sonner';

import { profileApi } from '~/services';

import { useProfile } from '~/hooks';

import { getErrorMessage } from '~/utils';

import { Button } from '~/components/common';
import { CreateAddressForm } from '~/components/pages/protected/profile/address';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '~/components/ui';

export const ProfileAddress = memo(() => {
  const { data: profile, refetch } = useProfile({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleConfirmDelete = useCallback((addressId: string) => {
    if (!addressId) {
      toast.error('Address ID is missing');
      return;
    }

    setAddressToDelete(addressId);
    setOpenDeleteDialog(true);
  }, []);
  const handleDeleteAddress = useCallback(async () => {
    if (!addressToDelete) return;

    try {
      setIsDeleting(true);

      const response = await profileApi.deleteAddress({ addressId: addressToDelete });
      if (response.status == 204) {
        toast.success('Address deleted successfully');
        await refetch();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
      setAddressToDelete(null);
    }
  }, [addressToDelete, refetch]);

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">My Address</h2>
        <CreateAddressForm />
      </div>
      <div className="flex flex-col gap-4 pt-4">
        {profile?.addresses?.map((add) => (
          <div key={add.addressType} className="flex items-center justify-between rounded border px-2 py-4">
            <h2 className="font-medium">{add.addressType}</h2>
            <p>{`${add.address}, ${add.city}, ${add.country}`}</p>
            <p>{add.recipientPhone}</p>

            <Button className="" disabled={!add.id || isDeleting} variant="destructive" onClick={() => handleConfirmDelete(add.id)}>
              <Trash className="" />
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete this address from your profile.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isDeleting} onClick={handleDeleteAddress}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});
