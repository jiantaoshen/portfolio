import "../globals.css";

import type { Metadata } from "next";

interface CareerLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Career Platform | JIANTAO.dev",

  robots: {
    index: false,
    follow: false,
  },

  icons: {
    icon: "/favicon-js.svg",
  },
};

export default function CareerLayout({
  children,
}: CareerLayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}