import type { Essay } from '@/src/web/api';

type EssayInfoProps = {
  essay: Essay;
};

export function EssayInfo({ essay }: EssayInfoProps) {
  return (
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
  );
}
