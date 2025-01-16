import type { Metadata } from "next";

import "./main.css";
import "./header.css";
import "./grid.css";

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
