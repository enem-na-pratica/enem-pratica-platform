const TOTAL_CARDS = 2;
const TOTAL_ROWS = 3;

export function PracticeSkeletons() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {Array.from({ length: TOTAL_CARDS }).map((_, i) => (
        <div
          key={i}
          className="card animate-pulse overflow-hidden border border-(--foreground)/10 p-0"
        >
          <div className="h-11 border-b border-(--foreground)/10 bg-(--foreground)/5" />
          <div className="space-y-2 p-4">
            {Array.from({ length: TOTAL_ROWS }).map((_, j) => (
              <div
                key={j}
                className="h-10 rounded-lg bg-(--foreground)/10"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
