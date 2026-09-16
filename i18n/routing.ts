import {defineRouting} from "next-intl/routing";

export const routing =
  defineRouting({
    locales: [
      "en",
      "sv",
      "zh",
    ],

    defaultLocale: "sv",
  });


export type Locale =
  (typeof routing.locales)[number];