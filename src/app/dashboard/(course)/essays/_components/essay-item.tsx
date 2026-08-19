import { CompetencyKey, Essay } from '@/src/web/api';

const COMPETENCIES: CompetencyKey[] = ['c1', 'c2', 'c3', 'c4', 'c5'];

export function EssayItem({ essay }: { essay: Essay }) {
  return (
    <div
      key={essay.id}
      className="card card-interactive flex flex-col gap-4 border-l-4 border-(--accent) py-4 md:flex-row md:items-center md:gap-8"
    >
      <div className="min-w-0 flex-1">
        <span className="font-mono text-[10px] tracking-tighter uppercase opacity-50">
          {essay.createdAt.toLocaleDateString('pt-BR')}
        </span>
        <h3
          className="truncate text-base font-bold"
          title={essay.theme}
        >
          {essay.theme}
        </h3>
      </div>

      <div className="hidden items-center gap-3 border-x border-(--foreground)/5 px-4 lg:flex">
        {COMPETENCIES.map((key) => (
          <div
            key={key}
            className="text-center"
          >
            <p className="text-[9px] font-bold uppercase opacity-40">{key}</p>
            <p className="font-mono text-xs font-bold">{essay.grades[key]}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-6 md:justify-end">
        <div className="text-right">
          <span className="block text-[10px] leading-none font-bold uppercase opacity-40">
            Total
          </span>
          <span className="text-2xl font-black text-(--accent)">
            {essay.grades.total}
          </span>
        </div>
      </div>
    </div>
  );
}
