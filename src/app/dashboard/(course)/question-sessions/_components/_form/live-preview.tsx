type LivePreviewProps = {
  correct: number;
  total: number;
};

const PERCENTAGE_MULTIPLIER = 100;

export function LivePreview({ correct, total }: LivePreviewProps) {
  const { hasValidTotal, incorrect, performance } = calculatePreviewMetrics({
    correct,
    total,
  });

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-(--foreground)/10 bg-(--foreground)/5 px-4 py-3 sm:ml-2">
      <div className="text-center">
        <p className="text-[10px] font-bold tracking-widest uppercase opacity-40">
          Erros
        </p>
        <p className="text-xl font-black text-(--error)">
          {hasValidTotal ? incorrect : '—'}
        </p>
      </div>
      <div className="hidden h-8 w-px bg-(--foreground)/10 sm:block" />
      <div className="text-center">
        <p className="text-[10px] font-bold tracking-widest uppercase opacity-40">
          Rendimento
        </p>
        <p className="text-xl font-black text-(--accent)">
          {performance !== null ? `${performance}%` : '—'}
        </p>
      </div>
    </div>
  );
}

function calculatePreviewMetrics({
  correct,
  total,
}: {
  correct: number;
  total: number;
}) {
  const validTotal = Number(total) || 0;
  const validCorrect = Number(correct) || 0;

  const incorrect = Math.max(0, validTotal - validCorrect);
  const hasValidTotal = validTotal > 0;

  const performance = hasValidTotal
    ? ((validCorrect / validTotal) * PERCENTAGE_MULTIPLIER).toFixed(0)
    : null;

  return {
    validTotal,
    validCorrect,
    incorrect,
    hasValidTotal,
    performance,
  };
}
