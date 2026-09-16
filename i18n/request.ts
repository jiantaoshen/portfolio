import * as rootParams from "next/root-params";

import {hasLocale} from "next-intl";

import {getRequestConfig} from "next-intl/server";

import {routing} from "./routing";


export default getRequestConfig(async ({locale: overrideLocale}) => {
    const paramLocale = await rootParams.locale();
    const requestedLocale = overrideLocale ?? paramLocale;

    const locale =
      requestedLocale && hasLocale(routing.locales, requestedLocale)
        ? requestedLocale
        : routing.defaultLocale;


    const [about, common, project, dashboard] =
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
        
        import(
          `./locales/${locale}/dashboard.json`
        ),
      ]);


    return {
      locale,

      messages: {
        about: about.default,

        common: common.default,

        project: project.default,

        dashboard: dashboard.default,
      },
    };
  },
);