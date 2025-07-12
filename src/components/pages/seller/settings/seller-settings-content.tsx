import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { Camera, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { CLOUDINARY_FOLDERS, DEFAULT_IMG_AVATAR } from '~/constants';

import type { DataForm, UpdateSellerProfileRequest } from '~/types';

import { authApi, sellerApi } from '~/services';

import { useCloudinaryUpload, useSellerProfile, useTranslation } from '~/hooks';

import { getErrorMessage, validates } from '~/utils';

import { Button } from '~/components/common';
import { CustomForm, CustomInput, CustomInputPassword, CustomInputTextarea } from '~/components/form';
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent } from '~/components/ui';

import { AUTH_ROUTES } from '~/routes';

export const SellerSettingsContent = memo(() => {
  const { t } = useTranslation();
  const { data: seller, refetch } = useSellerProfile({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  const { uploadFile, isUploading, progress, deleteUploadedImage } = useCloudinaryUpload({
    folder: CLOUDINARY_FOLDERS.SELLERS
  });

  useEffect(() => {
    if (!isEditing) {
      setAvatarPreview(null);
      setSelectedAvatar(null);
    }
  }, [isEditing]);

  const schema = useMemo(
    () =>
      z.object({
        shopName: z.string().min(1, { message: validates.required.message(t('Seller.shopName')) }),
        description: z.string().optional(),
        phone: z.string().min(1, {
          message: validates.required.message(t('Common.phone'))
        }),
        password: z.string().min(1, {
          message: validates.required.message(t('Seller.passwordRequiredForUpdate'))
        })
      }),
    [t]
  );

  const defaultValues = useMemo(
    () => ({
      shopName: seller?.shopName || '',
      description: seller?.description || '',
      phone: seller?.phone || '',
      email: seller?.email || '',
      password: ''
    }),
    [seller]
  );

  const handleAvatarChange = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setSelectedAvatar(file);

    return (): void => URL.revokeObjectURL(previewUrl);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await authApi.logout({ data: { directUri: AUTH_ROUTES.sellerLogin.path() } });
      toast.success(t('Common.logoutSuccess'));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to logout'));
    }
  }, [t]);

  const handleUpdateProfile = async (values: DataForm<typeof schema>): Promise<void> => {
    if (isLoading) return;
    let newAvatarId = '';

    try {
      setIsLoading(true);

      const { shopName, description, password, phone } = values;

      const updatedFields: UpdateSellerProfileRequest = {
        password
      };

      if (shopName !== seller?.shopName) {
        updatedFields.shopName = shopName;
      }

      if (description !== seller?.description) {
        updatedFields.description = description;
      }

      if (phone !== seller?.phone) {
        updatedFields.phone = phone;
      }

      if (selectedAvatar) {
        try {
          const response = await uploadFile(selectedAvatar);

          newAvatarId = response.public_id;

          updatedFields.shopAvatarUrl = response.secure_url;
          updatedFields.shopAvatarId = newAvatarId;
        } catch (error) {
          toast.error(getErrorMessage(error));
          throw error;
        }
      }

      const hasChanges = Object.keys(updatedFields).length > 1 || updatedFields.shopAvatarId;

      if (!hasChanges) {
        toast.info(t('Seller.noChangesDetected'));
        return;
      }

      const response = await sellerApi.updateProfile({ data: updatedFields });

      if (response.status == 200) {
        await refetch();
        toast.success(t('Seller.profileUpdatedSuccessfully'));
      }
    } catch (error) {
      toast.error(getErrorMessage(error, t('Seller.failedToUpdateProfile')));
      if (newAvatarId) deleteUploadedImage(newAvatarId);
    } finally {
      setAvatarPreview(null);
      setSelectedAvatar(null);
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex h-full w-full p-6">
      <Card className="w-full border-none shadow-none">
        <CardContent className="flex flex-col gap-8 p-0">
          <CustomForm key={seller?.email || 'no-seller'} options={{ defaultValues }} schema={schema} onSubmit={handleUpdateProfile}>
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                  <AvatarImage alt={seller?.shopName || 'Shop'} src={avatarPreview || seller?.shopAvatar?.url || DEFAULT_IMG_AVATAR} />
                  <AvatarFallback className="text-3xl">{seller?.shopName?.substring(0, 2).toUpperCase() || 'S'}</AvatarFallback>
                </Avatar>

                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
                    <div className="h-full w-full animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    {Object.values(progress)[0] > 0 && <div className="absolute text-sm font-medium text-white">{Object.values(progress)[0]}%</div>}
                  </div>
                )}

                {isEditing && (
                  // eslint-disable-next-line jsx-a11y/label-has-associated-control
                  <label
                    className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    htmlFor="avatar"
                  >
                    <Camera className="h-5 w-5" />
                  </label>
                )}

                <input accept="image/*" className="hidden" disabled={!isEditing || isLoading || isUploading} id="avatar" type="file" onChange={(e) => handleAvatarChange(e.target.files)} />
              </div>

              <h2 className="mt-4 text-2xl font-bold">{seller?.shopName}</h2>
              <p className="text-gray-500">{seller?.email}</p>
            </div>

            <div className="mb-4 flex justify-end">
              <Button disabled={isLoading || isUploading} type="button" variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? t('Common.cancel') : t('Seller.editProfile')}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <CustomInput disabled={!isEditing || isLoading || isUploading} label={t('Seller.shopName')} name="shopName" placeholder={t('Seller.shopNamePlaceholder')} />

              <CustomInput disabled label={t('Common.email')} name="email" placeholder={t('Common.emailPlaceholder')} />

              <CustomInput disabled={!isEditing || isLoading || isUploading} label={t('Common.phone')} name="phone" placeholder={t('Common.phonePlaceholder')} />

              <div className="md:col-span-2">
                <CustomInputTextarea disabled={!isEditing || isLoading || isUploading} label={t('Seller.shopDescription')} name="description" placeholder={t('Seller.shopDescriptionPlaceholder')} />
              </div>

              {isEditing && (
                <div className="md:col-span-2">
                  <CustomInputPassword disabled={isLoading || isUploading} label={t('Seller.passwordRequiredForUpdate')} name="password" placeholder={t('Common.enterPassword')} />
                </div>
              )}
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-center">
                <Button disabled={isLoading || isUploading} isLoading={isLoading || isUploading} type="submit">
                  {t('Seller.updateProfile')}
                </Button>
              </div>
            )}
          </CustomForm>
          <div className="mb-4 flex justify-end">
            <Button disabled={isLoading || isUploading} type="button" variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t('Common.logout')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
