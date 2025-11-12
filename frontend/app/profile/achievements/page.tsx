"use client";

import { useAuth } from "../../../hooks/useAuth";
import RouteGuard from "../../../components/RouteGuard";
import EmptyState from "../../../components/EmptyState";
import Link from "next/link";

function AchievementsContent() {
  const { user } = useAuth();

  const allBadges = [
    {
      code: "first-question",
      name: "First Question",
      description: "Asked your first question",
      icon: "❓",
      earned: false
    },
    {
      code: "first-answer",
      name: "First Answer",
      description: "Posted your first answer",
      icon: "💡",
      earned: false
    },
    {
      code: "helpful",
      name: "Helpful",
      description: "Received 10 upvotes on an answer",
      icon: "👍",
      earned: false
    },
    {
      code: "expert",
      name: "Expert",
      description: "Reached 1000 reputation points",
      icon: "⭐",
      earned: false
    },
    {
      code: "teacher",
      name: "Teacher",
      description: "Had an answer accepted",
      icon: "🎓",
      earned: false
    },
    {
      code: "contributor",
      name: "Contributor",
      description: "Posted 50 answers",
      icon: "🏆",
      earned: false
    }
  ];

  // Merge earned badges with all badges
  const badges = allBadges.map((badge) => {
    const earned = user?.badges?.find((b) => b.code === badge.code);
    return {
      ...badge,
      earned: !!earned,
      awardedAt: earned?.awardedAt
    };
  });

  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-4"
        >
          ← Back to Profile
        </Link>
        <h1 className="text-3xl font-semibold text-white">Achievements</h1>
        <p className="text-sm text-slate-400 mt-2">
          Your badges and milestones - {earnedBadges.length} of {badges.length} earned
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Progress</span>
          <span className="text-sm text-slate-400">
            {Math.round((earnedBadges.length / badges.length) * 100)}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Earned Badges</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {earnedBadges.map((badge) => (
              <div
                key={badge.code}
                className="rounded-xl border border-primary/30 bg-primary/5 p-6 transition hover:border-primary/50"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{badge.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{badge.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{badge.description}</p>
                    {badge.awardedAt && (
                      <p className="text-xs text-slate-500 mt-2">
                        Earned {new Date(badge.awardedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                    ✓
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Locked Badges</h2>
        {lockedBadges.length === 0 ? (
          <EmptyState
            icon="🎉"
            title="All badges earned!"
            description="Congratulations! You've earned all available badges."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {lockedBadges.map((badge) => (
              <div
                key={badge.code}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 opacity-60"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl grayscale">{badge.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-300">{badge.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{badge.description}</p>
                  </div>
                  <div className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-500">
                    🔒
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  return (
    <RouteGuard requireAuth>
      <AchievementsContent />
    </RouteGuard>
  );
}
