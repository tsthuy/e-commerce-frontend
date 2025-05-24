import { memo, useMemo, useState } from 'react';

import Cookie from 'js-cookie';
import { LockKeyhole, Mail, User } from 'lucide-react';
import { Link, useHistory } from 'react-router-dom';
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
import { CustomForm, CustomInput, CustomInputImage, CustomInputPassword } from '~/components/form';

import { AUTH_ROUTES, PUBLIC_ROUTES } from '~/routes';

export const SignUpPage = memo(() => {
  const { push } = useHistory();

  const schema = useMemo(
    () =>
      z.object({
        fullName: z.string().min(1, {
          message: validates.required.message('Full Name')
        }),
        email: z
          .string()
          .min(1, validates.required.message('Email'))
          .refine((value) => validates.email.pattern.test(value), validates.email.message),
        password: z
          .string()
          .min(1, {
            message: validates.required.message('Password')
          })
          .refine((value) => validates.password.length.pattern.test(value), validates.password.length.message),
        image: z
          .array(z.instanceof(File))
          .min(1, validates.required.message('Avatar'))
          .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), 'Image must be lower than 5MB')
      }),
    []
  );
  const defaultValues = useMemo(
    () => ({
      fullName: 'Huy Tran',
      email: 'doughdevx@gmail.com',
      password: '12345678',
      image: []
    }),
    []
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { uploadFile, isUploading, progress, deleteUploadedImage } = useCloudinaryUpload({
    folder: CLOUDINARY_FOLDERS.USERS
  });
  const handleSignUp = async (values: DataForm<typeof schema>): Promise<void> => {
    if (isLoading) return;

    let uploadedImagePublicId = '';

    try {
      setIsLoading(true);
      const { fullName, email, password, image } = values;

      if (image && image.length > 0) {
        const responses = await uploadFile(image[0]);
        const avatarUrl = responses.secure_url;
        uploadedImagePublicId = responses.public_id;

        try {
          const {
            data: { accessToken, refreshToken }
          } = await authApi.signup({ data: { email, password, fullName, avatarUrl, publicId: uploadedImagePublicId } });

          if (!!accessToken && !!refreshToken) {
            Cookie.set(COOKIE_KEYS.accessToken, accessToken, COOKIE_OPTIONS);
            Cookie.set(COOKIE_KEYS.refreshToken, refreshToken, COOKIE_OPTIONS);

            push(PUBLIC_ROUTES.index.path());
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
    <Helmet title={`Sign up to ${SEO_AUTHOR}`}>
      <AuthLayoutContent>
        <CustomForm options={{ defaultValues }} schema={schema} onSubmit={handleSignUp}>
          <div className="flex flex-col gap-4">
            <img alt={SEO_AUTHOR} className="mx-auto h-[90px] w-auto" src={LOGO} />

            <div className="">
              <CustomInput isRequired disabled={isLoading} label="Full Name" name="fullName" placeholder="Huy Tran" startIcon={User} />

              <CustomInput isRequired disabled={isLoading} label="Email Address" name="email" placeholder="example@gmail.com" startIcon={Mail} type="email" />

              <CustomInputPassword isRequired disabled={isLoading} label="Password" name="password" placeholder="********" startIcon={LockKeyhole} />

              <CustomInputImage isRequired multiple alt="Avatar" disabled={isLoading} label="Avatar" name="image" />

              <UploadProgress isUploading={isUploading} mode="single" progress={progress} />
            </div>
            <Button className="w-full" color="black" disabled={isLoading} type="submit">
              Sign Up
            </Button>

            <div className="text-center text-sm">
              Already have an account?
              <Link className="inline-flex" to={AUTH_ROUTES.login.path()}>
                <Button animation={{ type: 'line', placement: 'hide' }} className="h-fit p-0 after:!bottom-[-0.5px] after:!w-full" type="button" variant="link">
                  Go to login page
                </Button>
              </Link>
            </div>
          </div>
        </CustomForm>
      </AuthLayoutContent>
    </Helmet>
  );
});
