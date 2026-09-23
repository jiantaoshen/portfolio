import {
  CareerWorkspace,
} from "@/career/workspace";

import {
  getAboutContent,
} from "@/career/server/about-content";

interface TrialLayoutProps {
  children: React.ReactNode;
}

export default async function TrialLayout({
  children,
}: TrialLayoutProps) {
  const [
    initialAbout,
  ] = await Promise.all([
    Promise.resolve(
      getAboutContent(),
    ),
  ]);

  return (
    <CareerWorkspace
      mode="trial"
      initialAbout={
        initialAbout
      }
    >
      {children}
    </CareerWorkspace>
  );
}