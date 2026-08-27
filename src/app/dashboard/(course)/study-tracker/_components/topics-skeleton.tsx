const SKELETON_ROWS = Array.from({ length: 4 }, (_, index) => index + 1);

export function TopicsSkeleton() {
  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <ProgressSummarySkeleton />

      <hr className="border-(--foreground)/10" />

      <TopicListSkeleton />
    </div>
  );
}

function ProgressSummarySkeleton() {
  return (
    <div className="card animate-pulse space-y-4">
      {/* Title + progress */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-40 rounded bg-(--foreground)/10" />
        <div className="h-4 w-24 rounded bg-(--foreground)/10" />
      </div>

      {/* Progress bar */}
      <div className="h-3 w-full rounded-full bg-(--foreground)/10" />

      {/* Simulated legends */}
      <div className="flex flex-wrap gap-4 pt-1">
        <div className="h-3 w-24 rounded bg-(--foreground)/10" />
        <div className="h-3 w-20 rounded bg-(--foreground)/10" />
        <div className="h-3 w-20 rounded bg-(--foreground)/10" />
        <div className="h-3 w-20 rounded bg-(--foreground)/10" />
      </div>
    </div>
  );
}

function TopicListSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {SKELETON_ROWS.map((row) => (
        <div
          key={row}
          className="card flex flex-col justify-between gap-3 border-l-4 border-(--foreground)/20 py-4 sm:flex-row sm:items-center"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* Number */}
            <div className="h-4 w-5 shrink-0 rounded bg-(--foreground)/10" />

            {/* Title + status */}
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-(--foreground)/10 sm:w-64" />
              <div className="h-3 w-20 rounded-full bg-(--foreground)/10" />
            </div>
          </div>

          {/* Select */}
          <div className="h-10 w-full rounded bg-(--foreground)/10 sm:w-40" />
        </div>
      ))}
    </div>
  );
}
