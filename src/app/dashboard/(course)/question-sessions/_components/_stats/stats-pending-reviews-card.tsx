type StatsPendingReviewsCardProps = {
  pendingReviewsCount: number;
};

export function StatsPendingReviewsCard({
  pendingReviewsCount,
}: StatsPendingReviewsCardProps) {
  const hasPending = pendingReviewsCount > 0;

  return (
    <div
      className="card relative flex flex-1 flex-col justify-center overflow-hidden"
      style={{
        borderLeft: hasPending
          ? '3px solid var(--error)'
          : '3px solid var(--success)',
      }}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xl">📋</span>
        <h3 className="text-sm font-bold tracking-widest uppercase opacity-60">
          Revisar
        </h3>
      </div>
      <p
        className="text-3xl font-black"
        style={{ color: hasPending ? 'var(--error)' : 'var(--success)' }}
      >
        {pendingReviewsCount}
      </p>
      <p className="mt-0.5 text-xs opacity-40">sessões pendentes</p>
    </div>
  );
}
