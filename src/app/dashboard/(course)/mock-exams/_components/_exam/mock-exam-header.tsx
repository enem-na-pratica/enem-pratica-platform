type MockExamHeaderProps = {
  title: string;
  createdAt: Date;
  globalPerformance: number;
};

export function MockExamHeader({
  title,
  createdAt,
  globalPerformance,
}: MockExamHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-(--foreground)/5 bg-(--card-background) p-4">
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <span className="font-mono text-xs opacity-50">
          {createdAt.toLocaleDateString('pt-BR')}
        </span>
      </div>
      <div className="text-right">
        <span className="block text-xs font-bold uppercase opacity-50">
          Média Geral
        </span>
        <span className="text-2xl font-black text-(--accent)">
          {globalPerformance.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
