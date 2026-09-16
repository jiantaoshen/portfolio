import * as rootParams from "next/root-params";

import {hasLocale} from "next-intl";

import {getRequestConfig} from "next-intl/server";

import {notFound} from "next/navigation";

import {routing} from "./routing";


export default getRequestConfig(async ({locale: overrideLocale}) => {
    const paramLocale = await rootParams.locale();
    const locale = overrideLocale ?? paramLocale;

    if (!hasLocale(routing.locales, locale)) {
      notFound();
    }


    const [about, common, project] =
      await Promise.all([
        import(
          `./locales/${locale}/about.json`
        ),

        import(
          `./locales/${locale}/common.json`
        ),

        import(
          `./locales/${locale}/project.json`
        ),
      ]);


    return {
      locale,

      messages: {
        about: about.default,

        common: common.default,

        project: project.default,
      },
    };
  },
);