import { memo, useMemo } from 'react';

import { MoonIcon, SunIcon } from 'lucide-react';
import { z } from 'zod';

import type { DataForm } from '~/types';

import { useCustomForm } from '~/hooks';

import { Button, DetailsSection, Helmet } from '~/components/common';
import { CustomCheckbox, CustomForm, CustomRadio, CustomSwitch } from '~/components/form';
import { ContentAdminLayout } from '~/components/layouts/admin';

const OPTIONS = [
  {
    value: 'option-1',
    label: 'Option 1'
  },
  {
    value: 'option-2',
    label: 'Option 2'
  },
  {
    value: 'option-3',
    label: 'Option 3'
  }
];

export const CheckboxRadioSwitchPage = memo(() => {
  const schema = useMemo(
    () =>
      z.object({
        text1: z.boolean(),
        text2: z.boolean(),
        text3: z.boolean(),
        text4: z.boolean(),
        text5: z.boolean(),
        text6: z.boolean(),
        text7: z.boolean(),
        text8: z.boolean(),
        text9: z.boolean(),
        text10: z.boolean(),
        text11: z.string(),
        text12: z.string(),
        text13: z.string(),
        text14: z.string(),
        text15: z.boolean(),
        text16: z.boolean(),
        text17: z.boolean(),
        text18: z.boolean(),
        text19: z.boolean(),
        text20: z.boolean(),
        text21: z.boolean(),
        text22: z.boolean()
      }),
    []
  );
  const defaultValues: DataForm<typeof schema> = useMemo(
    () => ({
      text1: false,
      text2: false,
      text3: false,
      text4: false,
      text5: false,
      text6: false,
      text7: false,
      text8: false,
      text9: false,
      text10: false,
      text11: '',
      text12: '',
      text13: '',
      text14: '',
      text15: false,
      text16: false,
      text17: false,
      text18: false,
      text19: false,
      text20: false,
      text21: false,
      text22: false
    }),
    []
  );

  const { form } = useCustomForm(schema, { defaultValues });

  return (
    <Helmet title="Checkbox, Radio and Switch">
      <ContentAdminLayout breadcrumb={[{ label: 'Storybook' }, { label: 'Components' }, { label: 'Checkbox, Radio and Switch' }]}>
        <DetailsSection isHaveData>
          <div className="mb-10">
            <h2 className="mb-2 text-center text-xl font-bold">Checkbox, Radio and Switch</h2>
            <p className="text-center text-base text-muted-foreground">A growing collection of checkbox, radio and switch components.</p>
          </div>
          <CustomForm provider={form}>
            <div className="components__wrapper">
              <div className="components__item !text-left">
                <CustomCheckbox label="Simple checkbox" name="text1" />
              </div>
              <div className="components__item !text-left">
                <CustomCheckbox disabled label="Disabled checkbox" name="text2" />
              </div>
              <div className="components__item !text-left">
                <CustomCheckbox readOnly label="Readonly checkbox" name="text3" />
              </div>
              <div className="components__item !text-left">
                <CustomCheckbox readOnly label="Readonly checkbox" name="text4" />
              </div>
              <div className="components__item !text-left">
                <CustomCheckbox lineThrough label="Simple todo item" name="text5" />
              </div>
              <div className="components__item !text-left">
                <CustomCheckbox fancy lineThrough label="Fancy todo item" name="text6" />
              </div>
              <div className="components__item !text-left">
                <CustomCheckbox
                  name="text7"
                  label={
                    <>
                      I agree to the{' '}
                      <a className="underline underline-offset-2 transition-colors hover:text-primary" href="#terms">
                        terms of service
                      </a>
                    </>
                  }
                />
              </div>
              <div className="components__item !text-left">
                <CustomCheckbox align="right" label="Right aligned checkbox" name="text8" />
              </div>
              <div className="components__item !text-left">
                <CustomCheckbox
                  description="You can use this checkbox with a label and a description."
                  name="text9"
                  label={
                    <>
                      Label <span className="text-xs font-normal leading-[inherit] text-muted-foreground">(Sublabel)</span>
                    </>
                  }
                />
              </div>
              <div className="components__item !text-left">
                <CustomCheckbox
                  align="right"
                  description="You can use this checkbox with a label and a description."
                  name="text10"
                  label={
                    <>
                      Label <span className="text-xs font-normal leading-[inherit] text-muted-foreground">(Sublabel)</span>
                    </>
                  }
                />
              </div>
              <div className="components__item !text-left">
                <CustomRadio name="text11" options={OPTIONS} />
              </div>
              <div className="components__item !text-left">
                <CustomRadio name="text12" options={OPTIONS.map((option, index) => ({ ...option, disabled: index % 2 == 0 }))} />
              </div>
              <div className="components__item !text-left">
                <CustomRadio disabled name="text13" options={OPTIONS} />
              </div>
              <div className="components__item !text-left">
                <CustomRadio readOnly name="text14" options={OPTIONS} />
              </div>
              <div className="components__item !text-left">
                <CustomSwitch name="text15" />
              </div>
              <div className="components__item !text-left">
                <CustomSwitch label="Switch with label" name="text16" />
              </div>
              <div className="components__item !text-left">
                <CustomSwitch labelOff="Off" labelOn="On" labelStyle="dynamic" name="text17" />
              </div>
              <div className="components__item !text-left">
                <CustomSwitch labelLeft="Off" labelRight="On" name="text18" side="both" />
              </div>
              <div className="components__item !text-left">
                <CustomSwitch labelOff={<MoonIcon className="size-4" />} labelOn={<SunIcon className="size-4" />} labelStyle="dynamic" name="text19" />
              </div>
              <div className="components__item !text-left">
                <CustomSwitch labelLeft={<MoonIcon className="size-4" />} labelRight={<SunIcon className="size-4" />} name="text20" side="both" />
              </div>
              <div className="components__item !text-left">
                <CustomSwitch disabled label="Disabled switch" name="text21" />
              </div>
              <div className="components__item !text-left">
                <CustomSwitch readOnly label="Readonly switch" name="text22" />
              </div>
            </div>
            <div className="mt-10 flex items-center justify-end gap-4">
              <Button type="reset" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </CustomForm>
        </DetailsSection>
      </ContentAdminLayout>
    </Helmet>
  );
});
