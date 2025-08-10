import { memo, useMemo, useState } from 'react';

import { Building2, Flag, GlobeLock, MapPinHouse, Phone, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import type { DataForm } from '~/types';

import { profileApi } from '~/services';

import { useCustomForm, useProfile, useTranslation } from '~/hooks';

import { getErrorMessage, validates } from '~/utils';

import { Button } from '~/components/common';
import { CustomCheckbox, CustomForm, CustomInput, CustomInputNumber, CustomSelect } from '~/components/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, ScrollArea } from '~/components/ui';

export const CreateAddressForm = memo(() => {
  const { t } = useTranslation();
  const { data: profile, refetch } = useProfile({});

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const availableAddressTypes = useMemo(() => {
    return (profile?.availableAddressTypes || []).map((type) => ({
      value: type,
      label: type
    }));
  }, [profile]);
  const canAddAddress = useMemo(() => {
    return availableAddressTypes.length > 0;
  }, [availableAddressTypes]);
  const defaultAddressType = useMemo(() => {
    return availableAddressTypes.length > 0 ? availableAddressTypes[0].value : '';
  }, [availableAddressTypes]);

  const schema = useMemo(
    () =>
      z.object({
        country: z.string().min(1, {
          message: validates.required.message(t('Common.country'))
        }),
        city: z.string().min(1, {
          message: validates.required.message(t('Common.city'))
        }),
        address: z.string().min(1, {
          message: validates.required.message(t('Common.address'))
        }),
        recipientPhone: z.string().min(1, {
          message: validates.required.message(t('Common.recipientPhone'))
        }),
        zipCode: z.string().min(1, {
          message: validates.required.message(t('Common.zipCode'))
        }),
        addressType:
          availableAddressTypes.length > 0
            ? z.enum(availableAddressTypes.map((type) => type.value) as [string, ...string[]], {
                message: t('Common.pleaseSelectValidAddressType')
              })
            : z.enum(['HOME', 'WORK', 'OTHER'], {
                message: t('Common.pleaseSelectValidAddressType')
              }),
        isDefault: z.boolean()
      }),
    [availableAddressTypes, t]
  );
  const defaultValues = useMemo(
    () => ({
      country: '',
      city: '',
      address: '',
      recipientPhone: `${profile?.phone}`,
      zipCode: '',
      addressType: defaultAddressType,
      isDefault: false
    }),
    [profile?.phone, defaultAddressType]
  );

  const { form } = useCustomForm(schema, { defaultValues });

  const handleSaveAddress = async (values: DataForm<typeof schema>): Promise<void> => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const { address, addressType, city, country, isDefault, zipCode, recipientPhone } = values;

      const response = await profileApi.createAddress({ data: { address, recipientPhone, addressType, city, country, isDefault, zipCode } });

      if (response.status == 201) {
        toast.success(t('Common.addressSavedSuccessfully'));
        form.reset();
        refetch();
        setOpen(false);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!canAddAddress} variant="outline" onClick={() => setOpen(true)}>
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-[400px] overflow-hidden rounded-md sm:max-w-[50%]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl uppercase">{t('Common.addNewAddressTitle')}</DialogTitle>
          <DialogDescription className="text-center text-primary">{t('Common.addNewAddressDescription')}</DialogDescription>
        </DialogHeader>

        <div className="flex h-full max-h-[calc(90vh-180px)] flex-col">
          <ScrollArea className="flex-grow pr-4">
            <CustomForm className="flex flex-col space-y-4" provider={form} onSubmit={handleSaveAddress}>
              <CustomInput disabled={isLoading} label={t('Common.country')} name="country" startIcon={Flag} />
              <CustomInput disabled={isLoading} label={t('Common.city')} name="city" startIcon={Building2} />
              <CustomInput disabled={isLoading} label={t('Common.address')} name="address" startIcon={MapPinHouse} />
              <CustomInput disabled={isLoading} label={t('Common.recipientPhone')} name="recipientPhone" startIcon={Phone} />
              <CustomInputNumber disabled={isLoading} label={t('Common.zipCode')} name="zipCode" startIcon={GlobeLock} />
              <CustomSelect disabled={isLoading} label={t('Common.addressType')} name="addressType" options={availableAddressTypes} placeholder={t('Common.selectAddressType')} />
              <div className="flex items-center space-x-2">
                <CustomCheckbox disabled={isLoading} label={t('Common.makeDefaultAddress')} name="isDefault" />
              </div>

              <DialogFooter className="pt-4">
                <Button className="w-full hover:bg-custom-primary-bg-hover hover:text-black" disabled={isLoading} isLoading={isLoading} type="submit">
                  {t('Common.saveAddress')}
                </Button>
              </DialogFooter>
            </CustomForm>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
});
