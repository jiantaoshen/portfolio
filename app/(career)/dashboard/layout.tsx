import { CareerWorkspace } from "@/career/workspace";
import { getAboutContent } from "@/career/server/about-content";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({children}: DashboardLayoutProps) {
  const [initialAbout] = await Promise.all([getAboutContent()]);

  return (
    <CareerWorkspace initialAbout={initialAbout}>
      {children}
    </CareerWorkspace>
  );
}