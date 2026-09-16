import type {
  Locale,
} from "../../lib/types";

import {
  cn,
} from "@/lib/utils";


export const localeLabels: Record<
  Locale,
  string
> = {
  en: "English",
  sv: "Svenska",
  zh: "中文",
};


export function LocaleSwitcher({
  value,
  onChange,
}: {
  value: Locale;
  onChange: (
    locale: Locale,
  ) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {(
        Object.keys(
          localeLabels,
        ) as Locale[]
      ).map(
        (locale) => {
          const isActive =
            value === locale;

          return (
            <button
              key={
                locale
              }
              type="button"
              onClick={() =>
                onChange(
                  locale,
                )
              }
              className={cn(
                "relative py-2 text-sm font-medium transition-colors",

                isActive
                  ? "text-foreground after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:bg-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {
                localeLabels[
                  locale
                ]
              }
            </button>
          );
        },
      )}
    </div>
  );
}