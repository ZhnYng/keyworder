import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import Sidebar from "@/components/sidebar";
import { User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Keyworder",
  description: "Keyworder, the best stock image keywording tool",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          raleway.className
        )}
      >
        <div className="flex w-full min-h-screen">
          {user && <div className="w-64">
            <Sidebar />
          </div>}
          <div className="flex flex-col w-full min-h-screen flex-1">
            <header className="flex items-center p-4 justify-end">
            </header>
            {children}
          </div>
        </div>
        <Toaster />
        <SpeedInsights/>
        <Analytics/>
      </body>
    </html>
  );
}