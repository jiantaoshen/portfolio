import { CareerWorkspace } from "@/career/workspace";
import { getAboutContent } from "@/career/server/about-content";
import { getPortfolioContent } from "@/career/server/portfolio-content";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [initialContent, initialAbout] = await Promise.all([
    getPortfolioContent(),
    getAboutContent(),
  ]);

  return (
    <CareerWorkspace
      mode="admin"
      initialContent={initialContent}
      initialAbout={initialAbout}
    >
      {children}
    </CareerWorkspace>
  );
}