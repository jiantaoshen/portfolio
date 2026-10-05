import Footer from "@/components/page/Footer";
import Navbar from "@/components/page/Navbar";
import type { Locale } from "@/i18n/routing";

interface PortfolioLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function PortfolioLayout({
  children,
  params,
}: PortfolioLayoutProps) {
  const { locale } = await params;
  const currentLocale = locale as Locale;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar locale={currentLocale} />
        <main className="flex-1">{children}</main>
      <Footer locale={currentLocale} />
    </div>
  );
}
