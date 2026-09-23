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


    const [about, common, dashboard] =
      await Promise.all([
        import(
          `./locales/${locale}/about.json`
        ),

        import(
          `./locales/${locale}/common.json`
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


        dashboard: dashboard.default,
      },
    };
  },
);