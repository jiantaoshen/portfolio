import { CvEditorPage } from "./_pages/cv-editor";
import type { Locale } from "@/i18n/routing";

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;

  return (
    <CvEditorPage
      key={locale}
      initialLocale={locale as Locale}
    />
  );
}
