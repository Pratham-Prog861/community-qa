"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login?redirect=/profile");
    }
  }, [isAuthenticated, loading, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col gap-10 px-4 py-16">
      <header className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
              onError={(e) => {
                // Fallback to initial if image fails to load
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary ${user.avatarUrl ? "hidden" : ""}`}
          >
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-white">{user.name}</h1>
            <p className="text-sm text-slate-400">@{user.username}</p>
            <p className="text-xs text-slate-500">{user.bio || "Add a short bio to introduce yourself to the community."}</p>
          </div>
        </div>
        <div className="flex gap-3 text-xs text-slate-300">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-center">
            <p className="text-2xl font-semibold text-white">{user.reputation}</p>
            <p className="mt-1 uppercase tracking-wide text-slate-500">Points</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-center">
            <p className="text-2xl font-semibold text-white">{user.badges.length}</p>
            <p className="mt-1 uppercase tracking-wide text-slate-500">Badges</p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft">
          <h2 className="text-base font-semibold text-white">Recent activity</h2>
          <p className="text-sm text-slate-400">
            Activity feeds are coming soon. Share a question or answer to see your contributions here.
          </p>
        </div>

        <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-soft">
          <h2 className="text-base font-semibold text-white">Quick Links</h2>
          <div className="space-y-2 text-sm text-slate-200">
            <Link href="/profile/settings" className="flex items-center gap-3 rounded-lg border border-slate-700 px-4 py-2 transition hover:border-primary/60 hover:text-white">
              <span>⚙️</span>
              <span>Settings</span>
            </Link>
            <Link href="/profile/achievements" className="flex items-center gap-3 rounded-lg border border-slate-700 px-4 py-2 transition hover:border-primary/60 hover:text-white">
              <span>🏆</span>
              <span>Achievements</span>
            </Link>
            <Link href="/profile/drafts" className="flex items-center gap-3 rounded-lg border border-slate-700 px-4 py-2 transition hover:border-primary/60 hover:text-white">
              <span>📝</span>
              <span>Drafts</span>
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}

