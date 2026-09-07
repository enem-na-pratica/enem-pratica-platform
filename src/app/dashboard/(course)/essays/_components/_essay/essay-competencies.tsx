import type { CompetencyKey, Essay } from '@/src/web/api';

const COMPETENCIES: CompetencyKey[] = ['c1', 'c2', 'c3', 'c4', 'c5'];

type EssayCompetenciesProps = {
  grades: Essay['grades'];
};

export function EssayCompetencies({ grades }: EssayCompetenciesProps) {
  return (
    <div className="hidden items-center gap-3 border-x border-(--foreground)/5 px-4 lg:flex">
      {COMPETENCIES.map((key) => (
        <div
          key={key}
          className="text-center"
        >
          <p className="text-[9px] font-bold uppercase opacity-40">{key}</p>
          <p className="font-mono text-xs font-bold">{grades[key]}</p>
        </div>
      ))}
    </div>
  );
}
