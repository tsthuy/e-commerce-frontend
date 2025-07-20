import { memo, useMemo } from 'react';

import { MailIcon } from 'lucide-react';
import { z } from 'zod';

import type { DataForm } from '~/types';

import { useCustomForm } from '~/hooks';

import { validates } from '~/utils';

import { Button, DetailsSection, Helmet } from '~/components/common';
import {
  CustomForm,
  CustomInput,
  CustomInputCardBankAccount,
  CustomInputCardCode,
  CustomInputCardExpiryDate,
  CustomInputCardNumber,
  CustomInputDate,
  CustomInputNumber,
  CustomInputOTP,
  CustomInputPassword,
  CustomInputSearch,
  CustomInputTags,
  CustomInputTel,
  CustomInputTextarea,
  CustomInputTime,
  PaymentForm
} from '~/components/form';
import { ContentAdminLayout } from '~/components/layouts/admin/content';

export const InputsPage = memo(() => {
  const schema = useMemo(
    () =>
      z.object({
        text1: z.string(),
        text2: z
          .string()
          .trim()
          .min(1, {
            message: validates.required.message('Field')
          }),
        text3: z.string(),
        text4: z.string(),
        text5: z.string(),
        text6: z.string(),
        text7: z.string(),
        text8: z.string(),
        text9: z.string(),
        text10: z.string(),
        text11: z.string(),
        text12: z.string(),
        text13: z.string(),
        text14: z.string(),
        text15: z.any(),
        text16: z.any(),
        text17: z.string(),
        text18: z.string(),
        text19: z.string(),
        text20: z.string(),
        text21: z
          .string()
          .trim()
          .min(1, {
            message: validates.required.message('Field')
          }),
        text22: z.string(),
        text23: z.string(),
        text24: z.string(),
        text25: z.string(),
        text26: z.string(),
        text27: z.string(),
        text28: z.string(),
        text29: z.string(),
        text30: z.any(),
        text31: z.any(),
        text32: z.any(),
        text33: z.any(),
        text34: z.string(),
        text35: z.any(),
        text36: z.any(),
        text37: z.any()
      }),
    []
  );
  const defaultValues: DataForm<typeof schema> = useMemo(
    () => ({
      text1: '',
      text2: '',
      text3: '',
      text4: '',
      text5: '',
      text6: '',
      text7: '',
      text8: '',
      text9: '',
      text10: '',
      text11: '100',
      text12: '',
      text13: 'Hello World',
      text14: '',
      text15: '',
      text16: '',
      text17: '',
      text18: '',
      text19: '',
      text20: '',
      text21: '',
      text22: '',
      text23: '',
      text24: '',
      text25: '',
      text26: '',
      text27: '',
      text28: '',
      text29: '',
      text30: '',
      text31: '',
      text32: '',
      text33: '',
      text34: '',
      text35: [
        {
          id: '2250529376',
          text: 'Hello World'
        }
      ],
      text36: [
        {
          id: '2250529376',
          text: 'Hello World'
        }
      ],
      text37: ''
    }),
    []
  );

  const { form } = useCustomForm(schema, { defaultValues });

  return (
    <Helmet title="Input and Textarea">
      <ContentAdminLayout breadcrumb={[{ label: 'Storybook' }, { label: 'Components' }, { label: 'Input and Textarea' }]}>
        <DetailsSection isHaveData>
          <div className="mb-10">
            <h2 className="mb-2 text-center text-xl font-bold">Input and Textarea</h2>
            <p className="text-center text-base text-muted-foreground">A growing collection of input and textarea components.</p>
          </div>
          <CustomForm provider={form}>
            <PaymentForm>
              <div className="components__wrapper">
                <div className="components__item !text-left">
                  <CustomInput label="Simple input" name="text1" placeholder="Email" />
                </div>
                <div className="components__item !text-left">
                  <CustomInput isRequired label="Required input" name="text2" placeholder="Email" />
                </div>
                <div className="components__item !text-left">
                  <CustomInput description="We won‘t share your email with anyone" label="Input with helper text" name="text3" placeholder="Email" />
                </div>
                <div className="components__item !text-left">
                  <CustomInput disabled label="Disabled input" name="text4" placeholder="Email" />
                </div>
                <div className="components__item !text-left">
                  <CustomInput readOnly label="Readonly input" name="text5" placeholder="Email" />
                </div>
                <div className="components__item !text-left">
                  <CustomInput disabled isLoading label="Loading input" name="text6" placeholder="Email" />
                </div>
                <div className="components__item !text-left">
                  <CustomInput label="Input with start icon" name="text7" placeholder="Email" startIcon={MailIcon} />
                </div>
                <div className="components__item !text-left">
                  <CustomInput endIcon={MailIcon} label="Input with end icon" name="text8" placeholder="Email" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputNumber thousandSeparator label="Input number with prefix" name="text9" placeholder="$0.00" prefix="$" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputNumber thousandSeparator label="Input number with suffix" name="text10" placeholder="0.000₫" suffix="₫" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputNumber haveChevrons thousandSeparator label="Input number with chevrons" name="text11" placeholder="$0.00" suffix="$" />
                </div>
                <div className="components__item !text-left">
                  <CustomInput label="Input with overlap label" labelStyle="overlap" name="text12" placeholder="Email" />
                </div>
                <div className="components__item !text-left">
                  <CustomInput label="Input with dynamic label" labelStyle="dynamic" name="text13" />
                </div>
                <div className="components__item !text-left">
                  <CustomInput label="Input with inset label" labelStyle="inset" name="text14" placeholder="Email" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputDate label="Date picker" name="text15" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputDate label="Date range picker" mode="range" name="text16" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTime label="Date time" name="text37" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTel label="Phone number input" name="text17" placeholder="Enter phone number" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputOTP label="OTP input" name="text18" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputPassword label="Show/hide password input" name="text19" placeholder="Password" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTextarea label="Simple textarea" name="text20" placeholder="Leave a comment" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTextarea isRequired label="Required textarea" name="text21" placeholder="Leave a comment" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTextarea description="Please add as many details as you can" label="Textarea with helper text" name="text22" placeholder="Leave a comment" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTextarea disabled label="Disabled textarea" name="text23" placeholder="Leave a comment" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTextarea readOnly label="Readonly textarea" name="text24" placeholder="Leave a comment" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTextarea disabled isLoading label="Loading textarea" name="text25" placeholder="Leave a comment" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTextarea label="Textarea with overlap label" labelStyle="overlap" name="text26" placeholder="Leave a comment" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTextarea label="Textarea with dynamic label" labelStyle="dynamic" name="text27" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTextarea label="Textarea with inset label" labelStyle="inset" name="text28" placeholder="Leave a comment" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTextarea haveCountCharacters label="Textarea with characters left" maxLength={200} name="text29" placeholder="Leave a comment" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTextarea haveCountCharacters label="Textarea with characters left" maxLength={200} name="text29" placeholder="Leave a comment" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTextarea haveCountCharacters label="Textarea with characters left" maxLength={200} name="text29" placeholder="Leave a comment" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTextarea haveCountCharacters label="Textarea with characters left" maxLength={200} name="text29" placeholder="Leave a comment" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTextarea haveCountCharacters label="Textarea with characters left" maxLength={200} name="text29" placeholder="Leave a comment" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputCardNumber label="Card number" name="text30" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputCardExpiryDate label="Expiry date" name="text31" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputCardCode label="Code" name="text32" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputCardBankAccount label="Bank account" name="text33" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputSearch label="Search input with clear button" name="text34" placeholder="Search..." />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTags label="Input with tags" name="text35" placeholder="Add a tag" tagStyle="outside" />
                </div>
                <div className="components__item !text-left">
                  <CustomInputTags label="Input with inner tags" name="text36" placeholder="Add a tag" tagStyle="inside" />
                </div>
              </div>
              <div className="mt-10 flex items-center justify-end gap-4">
                <Button type="reset" variant="outline" onClick={() => form.reset()}>
                  Reset
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </PaymentForm>
          </CustomForm>
        </DetailsSection>
      </ContentAdminLayout>
    </Helmet>
  );
});
