import en from './en';
import fr from './fr';

const ui = { en, fr } as const;

export type UIKey = keyof typeof en;

export function t(key: UIKey, locale: string): string {
  const dict = ui[locale as keyof typeof ui] ?? ui.en;
  return dict[key] ?? en[key] ?? key;
}

export function getLocaleFromUrl(url: URL): string {
  const [, locale] = url.pathname.split('/');
  if (locale === 'fr') return 'fr';
  return 'en';
}
