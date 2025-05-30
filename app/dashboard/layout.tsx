import type { Metadata } from "next";
import "../globals.css";

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ModeToggle } from "@/components/theme/modetoggle";

export const metadata: Metadata = {
  title: "Feuerwehr Dornach - Social Media Tool",
  description: "Created by Yves Steinbach",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center">
              <div className="w-full flex flex-row items-center justify-between gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                  <div className="px-4">
                    <ModeToggle />
                  </div>
                </div>
              </header>
              <div className="flex align-center justify-center">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}