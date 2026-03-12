import { Pathnames } from "next-intl/routing";

export const locales = ["en", "zh", "ja", "es", "de", "pt"];

export const localeNames: any = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  es: "Español",
  de: "German",
  pt: "Portuguese",

};

export const defaultLocale = "en";

export const localePrefix = "as-needed";

export const localeDetection =
  process.env.NEXT_PUBLIC_LOCALE_DETECTION === "true";

export const pathnames = {
  en: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
  },
} satisfies Pathnames<typeof locales>;
