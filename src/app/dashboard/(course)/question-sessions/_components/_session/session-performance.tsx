const PERCENTAGE_MULTIPLIER = 100;

type SessionPerformanceProps = {
  performance: number;
};

export function SessionPerformance({ performance }: SessionPerformanceProps) {
  return (
    <div className="text-right">
      <span className="block text-[10px] leading-none font-bold uppercase opacity-40">
        Rendimento
      </span>
      <span className="text-2xl font-black text-(--accent)">
        {(performance * PERCENTAGE_MULTIPLIER).toFixed(0)}%
      </span>
    </div>
  );
}
