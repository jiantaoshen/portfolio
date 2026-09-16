import enAbout from "./locales/en/about.json";
import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enProject from "./locales/en/project.json";

import svAbout from "./locales/sv/about.json";
import svCommon from "./locales/sv/common.json";
import svHome from "./locales/sv/home.json";
import svProject from "./locales/sv/project.json";

import zhAbout from "./locales/zh/about.json";
import zhCommon from "./locales/zh/common.json";
import zhHome from "./locales/zh/home.json";
import zhProject from "./locales/zh/project.json";

import type {
  AboutTranslation,
  CommonTranslation,
  HomeTranslation,
  ProjectTranslation,
} from "./types";


export const locales = [
  "en",
  "sv",
  "zh",
] as const;


export type Locale =
  (typeof locales)[number];


export type TranslationMap = {
  about: AboutTranslation;
  common: CommonTranslation;
  home: HomeTranslation;
  project: ProjectTranslation;
};


export type Namespace =
  keyof TranslationMap;


type Translations = Record<
  Locale,
  TranslationMap
>;


const translations: Translations = {
  en: {
    about: enAbout,
    common: enCommon,
    home: enHome,
    project: enProject,
  },

  sv: {
    about: svAbout,
    common: svCommon,
    home: svHome,
    project: svProject,
  },

  zh: {
    about: zhAbout,
    common: zhCommon,
    home: zhHome,
    project: zhProject,
  },
};


export function getTranslations<
  N extends Namespace,
>(
  locale: Locale,
  namespace: N,
): TranslationMap[N] {
  return translations[
    locale
  ][namespace];
}


export function isLocale(
  value: string,
): value is Locale {
  return (
    locales as readonly string[]
  ).includes(value);
}