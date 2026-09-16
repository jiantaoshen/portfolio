import {
  CareerWorkspace,
} from "@/career/workspace";

import {
  getAboutContent,
} from "@/career/server/about-content";

import {
  getPortfolioContent,
} from "@/career/server/portfolio-content";

interface TrialLayoutProps {
  children: React.ReactNode;
}

export default async function TrialLayout({
  children,
}: TrialLayoutProps) {
  const [
    initialContent,
    initialAbout,
  ] = await Promise.all([
    getPortfolioContent(),
    Promise.resolve(
      getAboutContent(),
    ),
  ]);

  return (
    <CareerWorkspace
      mode="trial"
      initialContent={
        initialContent
      }
      initialAbout={
        initialAbout
      }
    >
      {children}
    </CareerWorkspace>
  );
}