import { headers } from "next/headers";
import { redirect } from "next/navigation";

function getBrowserLocale(acceptLanguage: string | null) {
  const primaryLanguage = acceptLanguage
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();

  if (primaryLanguage?.startsWith("zh")) return "zh";
  if (primaryLanguage?.startsWith("sv")) return "sv";

  return "en";
}

export default async function HomePage() {
  const headerStore = await headers();
  const locale = getBrowserLocale(headerStore.get("accept-language"));

  redirect(`/${locale}`);
}