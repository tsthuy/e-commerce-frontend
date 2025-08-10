import { memo } from 'react';

import { DEFAULT_IMG_PAYMENT, LOGO, SEO_AUTHOR } from '~/constants';

import { useTranslation } from '~/hooks';

import { Container } from '~/components/common';

export const FooterPublicLayout = memo(() => {
  const { t } = useTranslation();

  const footerSections = [
    {
      title: t('Footer.company'),
      links: [
        { label: t('Footer.aboutUs'), href: '/about' },
        { label: t('Footer.careers'), href: '/careers' },
        { label: t('Footer.press'), href: '/press' },
        { label: t('Footer.news'), href: '/news' }
      ]
    },
    {
      title: t('Footer.support'),
      links: [
        { label: t('Footer.contactUs'), href: '/contact' },
        { label: t('Footer.helpCenter'), href: '/help' },
        { label: t('Footer.safety'), href: '/safety' },
        { label: t('Footer.communityGuidelines'), href: '/guidelines' }
      ]
    }
  ];

  return (
    <footer className="w-full">
      <Container isFullWidth className="bg-black pt-12">
        <div className="mx-auto flex flex-col items-center justify-center gap-12 px-4 text-white md:flex-row md:gap-16 lg:justify-around">
          <div className="flex max-w-xs flex-col gap-8">
            <img alt={SEO_AUTHOR} className="h-8 w-auto brightness-0 invert" src={LOGO} />
            <p className="text-center text-gray-400">{t('Home.homeAndElements')}</p>
            <img alt="payment" src={DEFAULT_IMG_PAYMENT} />
          </div>
          <div className="flex gap-12">
            {footerSections.map((section) => (
              <div key={section.title} className="flex max-w-xs flex-col gap-4 text-center">
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <ul className="flex flex-col gap-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a className="text-gray-400 transition-colors hover:text-white" href={link.href}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black pb-4 pt-12">
          <p className="text-center text-xs text-gray-500 md:text-sm">
            © {new Date().getFullYear()} <span className="font-medium text-white">{SEO_AUTHOR}</span>. {t('Home.allRightsReserved')}
          </p>
        </div>
      </Container>
    </footer>
  );
});
