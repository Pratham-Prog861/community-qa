"use client";

const mockLeaders = [
  { name: "Aarav S.", role: "Backend Architect", points: 1820, badges: ["Top Contributor", "10 Upvotes Club"] },
  { name: "Mira T.", role: "Frontend Specialist", points: 1645, badges: ["First Answer", "Bug Squasher"] },
  { name: "Liam K.", role: "DevOps Engineer", points: 1510, badges: ["Top Contributor"] },
  { name: "Elena G.", role: "Data Scientist", points: 1425, badges: ["Knowledge Guru", "Insightful"] }
];

export default function LeaderboardPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col gap-8 px-4 py-16">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold text-white">Community leaderboard</h1>
        <p className="text-sm text-slate-400 md:text-base">
          Celebrate the members driving conversations forward with quality questions and accepted answers.
        </p>
      </header>

      <section className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-soft backdrop-blur">
        <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 border-b border-slate-800 pb-4 text-xs uppercase tracking-wide text-slate-500">
          <span>#</span>
          <span>Member</span>
          <span>Points</span>
        </div>
        {mockLeaders.map((leader, index) => (
          <article
            key={leader.name}
            className="grid grid-cols-[auto,1fr,auto] items-center gap-4 rounded-xl border border-slate-800/40 bg-slate-900/60 px-4 py-4 text-sm transition hover:border-primary/40 hover:bg-slate-900"
          >
            <span className="text-lg font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span>
            <div className="space-y-1">
              <p className="font-medium text-slate-100">{leader.name}</p>
              <p className="text-xs text-slate-400">{leader.role}</p>
              <div className="flex flex-wrap gap-2">
                {leader.badges.map((badge) => (
                  <span key={badge} className="rounded-full border border-slate-700 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-300">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-base font-semibold text-slate-100">{leader.points.toLocaleString()}</span>
          </article>
        ))}
      </section>
    </div>
  );
}

