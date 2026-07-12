"use client";

import Link from "next/link";

export default function DashboardHeader({ user, onLogout }) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="text-xl font-bold text-violet-600">
          Creator
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-600">{user?.name}</span>
          <button
            onClick={onLogout}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
