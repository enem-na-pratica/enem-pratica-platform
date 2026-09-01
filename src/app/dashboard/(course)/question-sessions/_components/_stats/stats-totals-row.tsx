type StatsTotalsRowProps = {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  totalIncorrect: number;
};

export function StatsTotalsRow({
  totalSessions,
  totalQuestions,
  totalCorrect,
  totalIncorrect,
}: StatsTotalsRowProps) {
  const items = [
    { label: 'Total de Sessões', value: totalSessions, icon: '📝' },
    { label: 'Total de Questões', value: totalQuestions, icon: '❓' },
    { label: 'Total de Acertos', value: totalCorrect, icon: '✅' },
    { label: 'Total de Erros', value: totalIncorrect, icon: '❌' },
  ];

  return (
    <div className="card flex flex-wrap items-center justify-around gap-6 py-4 lg:col-span-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center gap-1 text-center"
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-2xl font-black">{item.value}</span>
          <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
