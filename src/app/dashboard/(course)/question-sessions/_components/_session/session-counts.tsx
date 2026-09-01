type SessionCountsProps = {
  total: number;
  correct: number;
  incorrect: number;
};

export function SessionCounts({
  total,
  correct,
  incorrect,
}: SessionCountsProps) {
  return (
    <div className="flex items-center gap-5 border-x border-(--foreground)/5 px-4">
      <div className="text-center">
        <p className="text-[9px] font-bold uppercase opacity-40">Total</p>
        <p className="font-mono text-sm font-bold">{total}</p>
      </div>
      <div className="text-center">
        <p className="text-[9px] font-bold text-green-500/70 uppercase">
          Acertos
        </p>
        <p className="font-mono text-sm font-bold text-green-500">{correct}</p>
      </div>
      <div className="text-center">
        <p className="text-[9px] font-bold text-(--error)/70 uppercase">
          Erros
        </p>
        <p className="font-mono text-sm font-bold text-(--error)">
          {incorrect}
        </p>
      </div>
    </div>
  );
}
