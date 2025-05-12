import { memo, useMemo } from 'react';

import { z } from 'zod';

import type { DataForm } from '~/types';

import { useCustomForm } from '~/hooks';

import { validates } from '~/utils';

import { Button, DetailsSection, Helmet } from '~/components/common';
import { CustomForm, CustomMultiSelect, CustomSelect, CustomSelectSearch } from '~/components/form';
import { ContentAdminLayout } from '~/components/layouts/admin';

const OPTIONS = [
  {
    value: 'React',
    label: 'React'
  },
  {
    value: 'Next.js',
    label: 'Next.js'
  },
  {
    value: 'Astro',
    label: 'Astro'
  },
  {
    value: 'Gatsby',
    label: 'Gatsby'
  }
];
const STATUSES = [
  {
    label: 'Completed',
    value: 'Completed',
    color: 'text-emerald-600'
  },
  {
    label: 'In Progress',
    value: 'In Progress',
    color: 'text-blue-500'
  },
  {
    label: 'Pending',
    value: 'Pending',
    color: 'text-amber-500'
  },
  {
    label: 'Cancelled',
    value: 'Cancelled',
    color: 'text-gray-500'
  },
  {
    label: 'Failed',
    value: 'Failed',
    color: 'text-red-500'
  }
];
const FRAMEWORKS = [
  {
    value: 'next.js',
    label: 'Next.js'
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
    disabled: true
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js'
  },
  {
    value: 'remix',
    label: 'Remix'
  },
  {
    value: 'astro',
    label: 'Astro'
  },
  {
    value: 'angular',
    label: 'Angular'
  },
  {
    value: 'vue',
    label: 'Vue.js'
  },
  {
    value: 'react',
    label: 'React'
  },
  {
    value: 'ember',
    label: 'Ember.js'
  },
  {
    value: 'gatsby',
    label: 'Gatsby'
  },
  {
    value: 'eleventy',
    label: 'Eleventy'
  },
  {
    value: 'solid',
    label: 'SolidJS'
  },
  {
    value: 'preact',
    label: 'Preact'
  },
  {
    value: 'qwik',
    label: 'Qwik'
  },
  {
    value: 'alpine',
    label: 'Alpine.js'
  },
  {
    value: 'lit',
    label: 'Lit'
  }
];

export const SelectsPage = memo(() => {
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
        text15: z.string(),
        text16: z.string(),
        text17: z.any()
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
      text11: '',
      text12: STATUSES[0].value,
      text13: '',
      text14: '',
      text15: '',
      text16: '',
      text17: [FRAMEWORKS[2], FRAMEWORKS[3]]
    }),
    []
  );

  const { form } = useCustomForm(schema, { defaultValues });

  return (
    <Helmet title="Select">
      <ContentAdminLayout breadcrumb={[{ label: 'Storybook' }, { label: 'Components' }, { label: 'Select' }]}>
        <DetailsSection isHaveData>
          <div className="mb-10">
            <h2 className="mb-2 text-center text-xl font-bold">Select</h2>
            <p className="text-center text-base text-muted-foreground">A growing collection of select components.</p>
          </div>
          <CustomForm provider={form}>
            <div className="components__wrapper">
              <div className="components__item !text-left">
                <CustomSelect label="Simple select" name="text1" options={OPTIONS} placeholder="Please select a value" />
              </div>
              <div className="components__item !text-left">
                <CustomSelect isRequired label="Required select" name="text2" options={OPTIONS} placeholder="Please select a value" />
              </div>
              <div className="components__item !text-left">
                <CustomSelect disabled label="Disabled select" name="text3" options={OPTIONS} placeholder="Please select a value" />
              </div>
              <div className="components__item !text-left">
                <CustomSelect readOnly label="Readonly select" name="text4" options={OPTIONS} placeholder="Please select a value" />
              </div>
              <div className="components__item !text-left">
                <CustomSelect disabled isLoading label="Loading select" name="text5" options={OPTIONS} placeholder="Please select a value" />
              </div>
              <div className="components__item !text-left">
                <CustomSelect label="Select with overlap label" labelStyle="overlap" name="text6" options={OPTIONS} placeholder="Please select a value" />
              </div>
              <div className="components__item !text-left">
                <CustomSelect label="Select with dynamic label" labelStyle="dynamic" name="text7" options={OPTIONS} />
              </div>
              <div className="components__item !text-left">
                <CustomSelect label="Select with inset label" labelStyle="inset" name="text8" options={OPTIONS} placeholder="Please select a value" />
              </div>
              <div className="components__item !text-left">
                <CustomMultiSelect label="Multiselect" name="text17" options={FRAMEWORKS} placeholder="Select frameworks" />
              </div>
              <div className="components__item !text-left">
                <CustomSelect description="Tell us what‘s your favorite Select framework" label="Select with help text" name="text9" options={OPTIONS} placeholder="Please select a value" />
              </div>
              <div className="components__item !text-left">
                <CustomSelect label="Select with disabled option" name="text10" options={OPTIONS.map((item, index) => ({ ...item, disabled: index % 2 === 0 }))} placeholder="Please select a value" />
              </div>
              <div className="components__item !text-left">
                <CustomSelect rightIndicator label="Select with right indicator" name="text11" options={OPTIONS} placeholder="Please select a value" />
              </div>
              <div className="components__item !text-left">
                <CustomSelect rightIndicator statusSelect label="Status select" name="text12" options={STATUSES} placeholder="Please select a value" />
              </div>
              <div className="components__item !text-left">
                <CustomSelectSearch label="Select search" name="text13" options={FRAMEWORKS} placeholder="Select framework" placeholderInputSearch="Search framework" />
              </div>
              <div className="components__item !text-left">
                <CustomSelectSearch
                  label="Select search with overlap label"
                  labelStyle="overlap"
                  name="text14"
                  options={FRAMEWORKS}
                  placeholder="Select framework"
                  placeholderInputSearch="Search framework"
                />
              </div>
              <div className="components__item !text-left">
                <CustomSelectSearch label="Select search with dynamic label" labelStyle="dynamic" name="text15" options={FRAMEWORKS} placeholderInputSearch="Search framework" />
              </div>
              <div className="components__item !text-left">
                <CustomSelectSearch
                  label="Select search with inset label"
                  labelStyle="inset"
                  name="text16"
                  options={FRAMEWORKS}
                  placeholder="Select framework"
                  placeholderInputSearch="Search framework"
                />
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
