import { memo } from 'react';

import { FAQ_DATA } from '~/constants';

import { useTranslation } from '~/hooks';

import { Container } from '~/components/common';
import { ScrollArea } from '~/components/ui';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';

export const FAQPage = memo(() => {
  const { t } = useTranslation();

  return (
    <Container isFitScreen>
      <h1 className="py-8 text-2xl font-bold">{t('FAQ.title')}</h1>

      <ScrollArea className="h-[calc(100svh-(var(--header-public)*2)-(var(--footer-public))-96px)]">
        <Accordion collapsible className="w-full" type="single">
          {FAQ_DATA.map((faq, index) => (
            <AccordionItem key={`faq-${index}`} value={`item-${index}`}>
              <AccordionTrigger className="text-left hover:no-underline">
                <h3 className="text-lg font-medium">{t(faq.questionKey)}</h3>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">{t(faq.answerKey)}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </Container>
  );
});
