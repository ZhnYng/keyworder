"use client";

import { Home, LayoutDashboard, Loader2, LogOut, Settings, Wallet, WholeWord } from "lucide-react"
import Link from "next/link"
import { redirect, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "./ui/use-toast";
import React from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/login/actions";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  return (
    <aside className="hidden w-64 bg-muted/40 flex-col border-r p-6 sm:flex fixed h-screen">
      <div className="mb-6">
        <Link href="#" className="flex items-center gap-2 font-bold" prefetch={false}>
          <WholeWord className="h-6 w-6" />
          <span>Keyworder</span>
        </Link>
      </div>
      <nav className="flex flex-col space-y-2 flex-grow">
        <Link
          href="/collections"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${pathname.includes('/collections') ? 'bg-muted text-foreground' : ''}`}
          prefetch={false}
        >
          <LayoutDashboard className="h-4 w-4" />
          Collections
        </Link>
        <Link
          href="/billing"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${pathname.includes('/billing') ? 'bg-muted text-foreground' : ''}`}
          prefetch={false}
        >
          <Wallet className="h-4 w-4" />
          Billing
        </Link>
      </nav>
      <div className="mt-auto">
        <Button
          onClick={() => startTransition(logout)}
          className="w-full"
          variant="default"
        >
          {isPending ? 
          <Loader2 className="animate-spin" />
          :
          <div className="flex w-full justify-center items-center">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </div>}
        </Button>
      </div>
    </aside>
  )
}