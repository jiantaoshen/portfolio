import {Suspense} from "react";
import "@/app/globals.css";


export default function CareerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en">
    <body>
      <Suspense fallback={<div className="min-h-screen bg-background" />} >
        {children}
      </Suspense>
      </body>
    </html>
  );
}