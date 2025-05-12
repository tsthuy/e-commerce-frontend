import { LANGUAGES } from '~/constants';

/**
 * Formats a number as a currency string based on the provided locale or the default language settings.
 * This function is useful for formatting prices in various locales and currencies according to the application's language settings.
 *
 * @param {number} price - The amount to be formatted as a currency.
 * @param {string} [locale] - Optional. The locale identifier (e.g., 'en-US', 'fr-FR') to format the currency.
 *                            If not provided, the default locale and currency from `LANGUAGES` is used.
 *
 * @returns {string} - The formatted currency string for the given locale or default locale if none is specified.
 *
 * Example usage:
 *
 * const formattedPrice = formatCurrency(1000, 'en-US');
 * log(formattedPrice); // "$1,000.00" (in USD for US locale)
 *
 * const formattedPriceDefault = formatCurrency(1000);
 * log(formattedPriceDefault); // Default formatted price based on default locale and currency
 */

export function formatCurrency(price: number, locale?: string): string {
  return new Intl.NumberFormat(LANGUAGES.find((item) => (locale ? item.i18n === locale : item.isDefault))?.currency.locale, {
    style: 'currency',
    currency: LANGUAGES.find((item) => (locale ? item.i18n === locale : item.isDefault))?.currency.unit
  }).format(price);
}
