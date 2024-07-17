"use client";

import { Home, LayoutDashboard, Settings, Wallet, WholeWord } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 bg-muted/40 flex-col border-r p-6 sm:flex">
      <div className="mb-6">
        <Link href="#" className="flex items-center gap-2 font-bold" prefetch={false}>
          <WholeWord className="h-6 w-6" />
          <span>Keyworder</span>
        </Link>
      </div>
      <nav className="flex flex-col space-y-2">
        <Link
          href="/"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${pathname === '/' ? 'bg-muted text-foreground' : ''}`}
          prefetch={false}
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
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
        <Link
          href="/settings"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${pathname.includes('/settings') ? 'bg-muted text-foreground' : ''}`}
          prefetch={false}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </nav>
    </aside>
  )
}