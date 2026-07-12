"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardHeader({ user, onLogout }) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-xl font-bold text-violet-600 dark:text-violet-400">
          Creator
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-600 dark:text-zinc-300">{user?.name}</span>
          <ThemeToggle />
          <button
            onClick={onLogout}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
