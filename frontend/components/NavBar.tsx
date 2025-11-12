"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { useAuth } from "../hooks/useAuth";

export const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const authedLinks = [
    { href: "/questions", label: "Questions" },
    { href: "/", label: "Home" },
    { href: "/ask", label: "Ask" },
    { href: "/leaderboard", label: "Leaderboard" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : [])
  ];

  const publicLinks = [
    { href: "/questions", label: "Questions" },
    { href: "/", label: "Home" },
    { href: "/leaderboard", label: "Leaderboard" }
  ];

  const linksToRender = isAuthenticated ? authedLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900/60 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 font-bold text-primary">
            CQ
          </span>
          Community Q&A
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          {linksToRender.map((link) => (
            <Link key={link.href} href={link.href} className="text-slate-300 transition hover:text-white">
              {link.label}
            </Link>
          ))}
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary/90"
              >
                Create account
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-primary/40 hover:text-white"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-primary/20"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs text-primary ${user?.avatarUrl ? "hidden" : ""}`}>
                  {user?.name?.slice(0, 1).toUpperCase()}
                </span>
                {user?.username}
              </Link>
              <button
                onClick={() => {
                  void logout();
                }}
                className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-400/60 hover:text-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-800 text-slate-300 transition hover:border-slate-600 hover:text-white sm:hidden"
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>
      <nav
        className={clsx(
          "sm:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <div className="mx-4 mb-4 space-y-2 rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-soft backdrop-blur">
          {linksToRender.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex rounded-lg px-3 py-2 text-slate-200 transition hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated ? (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="flex rounded-lg border border-slate-700 px-3 py-2 text-center text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
              >
                Create account
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                void logout();
                setOpen(false);
              }}
              className="flex w-full rounded-lg border border-slate-800 px-3 py-2 text-center text-sm font-semibold text-slate-300 transition hover:border-red-400/60 hover:text-red-400"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

