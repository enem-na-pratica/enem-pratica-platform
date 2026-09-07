type EssayTotalProps = {
  total: number;
};

export function EssayTotal({ total }: EssayTotalProps) {
  return (
    <div className="text-right">
      <span className="block text-[10px] leading-none font-bold uppercase opacity-40">
        Total
      </span>
      <span className="text-2xl font-black text-(--accent)">{total}</span>
    </div>
  );
}
