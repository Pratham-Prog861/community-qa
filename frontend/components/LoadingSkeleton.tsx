export default function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 animate-pulse"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-5 w-20 bg-slate-700 rounded" />
                <div className="h-4 w-32 bg-slate-700 rounded" />
              </div>
              <div className="h-4 w-3/4 bg-slate-700 rounded" />
              <div className="h-3 w-1/2 bg-slate-700 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-slate-700 rounded" />
              <div className="h-8 w-16 bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
