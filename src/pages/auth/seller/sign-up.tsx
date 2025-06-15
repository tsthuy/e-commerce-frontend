import { memo, useMemo, useState } from 'react';

import Cookie from 'js-cookie';
import { FolderPen, LockKeyhole, Mail, MapPin } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { CLOUDINARY_FOLDERS, COOKIE_KEYS, COOKIE_OPTIONS, LOGO, SEO_AUTHOR } from '~/constants';

import type { DataForm } from '~/types';

import { authApi } from '~/services';

import { useCloudinaryUpload } from '~/hooks';

import { getErrorMessage, validates } from '~/utils';

import { AuthLayoutContent } from '~/layouts';

import { Button, Helmet } from '~/components/common';
import { UploadProgress } from '~/components/common/cloudinary';
import { CustomForm, CustomInput, CustomInputImage, CustomInputPassword, CustomInputTel } from '~/components/form';

import { SELLER_ROUTES } from '~/routes';

export const SellerSignUpPage = memo(() => {
  const { push } = useHistory();

  const schema = useMemo(
    () =>
      z.object({
        shopName: z.string().min(1, validates.required.message('Shop Name')),
        phone: z.string().min(1, validates.required.message('Phone')),
        email: z
          .string()
          .min(1, validates.required.message('Email'))
          .refine((value) => validates.email.pattern.test(value), validates.email.message),
        address: z.string().min(1, validates.required.message('Address')),
        password: z.string().min(1, validates.required.message('Password')),
        image: z
          .array(z.instanceof(File))
          .min(1, validates.required.message('Avatar'))
          .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024))
      }),
    []
  );
  const defaultValues = useMemo(
    () => ({
      shopName: '',
      phone: '',
      email: '',
      address: '',
      password: '',
      image: []
    }),
    []
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { uploadFile, deleteUploadedImage, isUploading, progress } = useCloudinaryUpload({ folder: CLOUDINARY_FOLDERS.SELLERS });
  const handleSellerSignup = async (values: DataForm<typeof schema>): Promise<void> => {
    if (isLoading) return;

    let uploadedImagePublicId = '';

    try {
      setIsLoading(true);
      const { shopName, image, address, email, password, phone } = values;

      if (image && image.length > 0) {
        const response = await uploadFile(image[0]);
        const shopAvatarUrl = response.secure_url;
        uploadedImagePublicId = response.public_id;

        try {
          const {
            data: { accessToken, refreshToken }
          } = await authApi.signupAsSeller({ data: { shopName, email, password, phone, address, shopAvatarUrl, shopAvatarId: uploadedImagePublicId } });

          if (!!accessToken && !!refreshToken) {
            Cookie.set(COOKIE_KEYS.accessToken, accessToken, COOKIE_OPTIONS);
            Cookie.set(COOKIE_KEYS.refreshToken, refreshToken, COOKIE_OPTIONS);

            push(SELLER_ROUTES.dashboard.path());
            toast.success('Signed Up Successfully');
          } else {
            throw new Error();
          }
        } catch (error) {
          await deleteUploadedImage(uploadedImagePublicId);
          toast.error(getErrorMessage(error));
        }
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Helmet title={`Become a seller with ${SEO_AUTHOR}`}>
      <AuthLayoutContent>
        <CustomForm options={{ defaultValues }} schema={schema} onSubmit={handleSellerSignup}>
          <div className="flex flex-col gap-4">
            <img alt={SEO_AUTHOR} className="mx-auto h-[90px] w-auto" src={LOGO} />

            <h1 className="text-center text-xl font-bold uppercase text-primary">Become a seller with {SEO_AUTHOR}</h1>
            <div className="">
              <CustomInput isRequired disabled={isLoading} label="Shop Name" name="shopName" startIcon={FolderPen} />
              <CustomInputTel isRequired disabled={isLoading} label="Phone Number" name="phone" />

              <CustomInput isRequired disabled={isLoading} label="Email Address" name="email" placeholder="example@gmail.com" startIcon={Mail} type="email" />

              <CustomInput isRequired disabled={isLoading} label="Address" name="address" placeholder="Your business address" startIcon={MapPin} />

              <CustomInputPassword isRequired disabled={isLoading} label="Password" name="password" placeholder="********" startIcon={LockKeyhole} />

              <CustomInputImage disabled={isLoading} name="image" />

              <UploadProgress isUploading={isUploading} mode="single" progress={progress} />
            </div>
            <Button className="w-full" disabled={isLoading || isUploading} isLoading={isLoading || isUploading} type="submit">
              Sign Up
            </Button>
          </div>
        </CustomForm>
      </AuthLayoutContent>
    </Helmet>
  );
});
