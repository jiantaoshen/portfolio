import { getAboutContent } from "@/server/about-content";
import { CareerWorkspace } from "@/app/[locale]/(career)/dashboard/workspace";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CareerWorkspace initialAbout={getAboutContent()}>
      {children}
    </CareerWorkspace>
  );
}
