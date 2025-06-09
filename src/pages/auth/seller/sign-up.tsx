import { memo, useMemo, useState } from 'react';

import { FolderPen, LockKeyhole, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { LOGO, SEO_AUTHOR } from '~/constants';

import type { DataForm } from '~/types';

import { getErrorMessage, validates } from '~/utils';

import { AuthLayoutContent } from '~/layouts';

import { Button, Helmet } from '~/components/common';
import { CustomForm, CustomInput, CustomInputImage, CustomInputPassword, CustomInputTel } from '~/components/form';

export const SellerSignUpPage = memo(() => {
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
  const handleSellerSignup = async (values: DataForm<typeof schema>): Promise<void> => {
    alert('???');
    if (isLoading) return;

    try {
      setIsLoading(true);
      const { shopName, image } = values;
      console.log(shopName, image[0]);
    } catch (error) {
      toast.error(getErrorMessage(error));
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
            </div>
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </div>
        </CustomForm>
      </AuthLayoutContent>
    </Helmet>
  );
});
