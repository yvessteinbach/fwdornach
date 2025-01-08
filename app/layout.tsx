import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FW-Dornach",
  description: "NEXTJS APP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
