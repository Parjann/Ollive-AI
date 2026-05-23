"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, Terminal, Activity, ChevronRight } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const isDashboard = pathname === "/dashboard"

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/40 bg-zinc-950/60 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Side Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
              Ollive AI
            </span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase -mt-1">
              Observability
            </span>
          </div>
        </div>

        {/* Center/Right Status Dot & Navigation */}
        <div className="flex items-center gap-6">
          {/* Active Status */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-3 py-1 text-[11px] font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Observability Active
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
                !isDashboard
                  ? "bg-zinc-800/80 text-white shadow-inner"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <Terminal className="h-4 w-4" />
              Playground
            </Link>

            <Link
              href="/dashboard"
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
                isDashboard
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <Activity className="h-4 w-4" />
              Metrics
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
