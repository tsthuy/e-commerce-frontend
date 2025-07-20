import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { CLOUDINARY_FOLDERS, DEFAULT_IMG_AVATAR } from '~/constants';

import type { DataForm, UpdateProfileRequest } from '~/types';

import { profileApi } from '~/services';

import { useCloudinaryUpload, useProfile } from '~/hooks';

import { getErrorMessage, validates } from '~/utils';

import { Button } from '~/components/common';
import { CustomForm, CustomInput } from '~/components/form';
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent } from '~/components/ui';

export const ProfileContent = memo(() => {
  const { data: profile, refetch } = useProfile({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  const { uploadFile, isUploading, progress, deleteUploadedImage } = useCloudinaryUpload({
    folder: CLOUDINARY_FOLDERS.USERS
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
        fullName: z.string().min(1, { message: validates.required.message('Full Name') }),
        email: z
          .string()
          .min(1, {
            message: validates.required.message('Email')
          })
          .refine((value) => validates.email.pattern.test(value), validates.email.message),
        phone: z.string().min(1, {
          message: validates.required.message('Phone Number')
        })
      }),
    []
  );

  const defaultValues = useMemo(
    () => ({
      fullName: profile?.fullName || '',
      email: profile?.email || '',
      phone: profile?.phone || ''
    }),
    [profile]
  );

  const handleAvatarChange = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setSelectedAvatar(file);

    return (): void => URL.revokeObjectURL(previewUrl);
  }, []);

  const handleUpdateProfile = async (values: DataForm<typeof schema>): Promise<void> => {
    if (isLoading) return;
    let newAvatarId = '';

    try {
      setIsLoading(true);

      const { fullName, phone } = values;

      const updatedFields: UpdateProfileRequest = {};

      if (fullName !== profile?.fullName) {
        updatedFields.fullName = fullName;
      }

      if (phone !== profile?.phone) {
        updatedFields.phone = phone;
      }

      if (selectedAvatar) {
        try {
          const response = await uploadFile(selectedAvatar);

          newAvatarId = response.public_id;

          updatedFields.avatarUrl = response.secure_url;
          updatedFields.avatarPublicId = newAvatarId;
        } catch (error) {
          toast.error(getErrorMessage(error));
          throw error;
        }
      }

      const hasChanges = Object.keys(updatedFields).length > 0 || updatedFields.avatarPublicId;

      if (!hasChanges) {
        toast.info('No changes detected');
        return;
      }

      const response = await profileApi.updateProfile({ data: updatedFields });

      if (response.status == 200) {
        await refetch();
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update profile'));
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
          <CustomForm options={{ defaultValues }} schema={schema} onSubmit={handleUpdateProfile}>
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                  <AvatarImage alt={profile?.fullName || 'Profile'} src={avatarPreview || profile?.avatar?.url || DEFAULT_IMG_AVATAR} />
                  <AvatarFallback className="text-3xl">{profile?.fullName?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
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

              <h2 className="mt-4 text-2xl font-bold">{profile?.fullName}</h2>
              <p className="text-gray-500">{profile?.email}</p>
            </div>

            <div className="mb-4 flex justify-end">
              <Button disabled={isLoading || isUploading} type="button" variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <CustomInput disabled={!isEditing || isLoading || isUploading} label="Full Name" name="fullName" placeholder="Your full name" />

              <CustomInput disabled label="Email Address" name="email" placeholder="Your email" />

              <CustomInput disabled={!isEditing || isLoading || isUploading} label="Phone Number" name="phone" placeholder="Your phone number" />
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-center">
                <Button disabled={isLoading || isUploading} isLoading={isLoading || isUploading} type="submit">
                  Update Profile
                </Button>
              </div>
            )}
          </CustomForm>
        </CardContent>
      </Card>
    </div>
  );
});
