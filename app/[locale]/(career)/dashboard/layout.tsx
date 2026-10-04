import { getAboutContent } from "@/career/server/about-content";
import { CareerWorkspace } from "@/career/workspace";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CareerWorkspace initialAbout={getAboutContent()}>
      {children}
    </CareerWorkspace>
  );
}
