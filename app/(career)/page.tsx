import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getPreferredLocaleFromAcceptLanguage } from "@/lib/locales";

export default async function HomePage() {
  const headerStore = await headers();
  const locale = getPreferredLocaleFromAcceptLanguage(
    headerStore.get("accept-language"),
  );

  redirect(`/${locale}`);
}