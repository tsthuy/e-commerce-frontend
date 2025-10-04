import { memo } from 'react';

import { useTranslation } from '~/hooks';

import { Button, Container } from '~/components/common';
import { CustomForm, CustomInput } from '~/components/form';

export const Contact = memo(() => {
  const { t } = useTranslation();

  return (
    <Container isFullWidth className="bg-primary">
      <Container className="px-4 py-12">
        <div className="flex items-center justify-between gap-8">
          <h2 className="text-center text-2xl font-bold uppercase text-white">{t('Common.subscribeNewsletter')}</h2>
          <CustomForm className="flex w-full max-w-[400px] flex-col items-end gap-4 sm:flex-row sm:items-start">
            <CustomInput className="w-full" name="contact" placeholder={t('Common.enterYourEmail')} />
            <Button className="w-fit bg-custom-green" type="submit">
              {t('Common.submit')}
            </Button>
          </CustomForm>
        </div>
      </Container>
    </Container>
  );
});
