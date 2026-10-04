import "@/app/globals.css";

export default function CareerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
