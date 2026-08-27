import { ChevronDown, LoaderCircle } from 'lucide-react';

import type { Subject } from '@/src/web/api';

type SubjectSelectorProps = {
  subjects: Subject[];
  selectedSubjectSlug: string;
  isLoadingSubject: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

function SubjectOptions({ subjects }: { subjects: Subject[] }) {
  return (
    <>
      <option
        value=""
        disabled
      >
        — Escolha uma matéria para começar —
      </option>
      {subjects.map((s) => (
        <option
          key={s.id}
          value={s.slug}
        >
          {s.name}
          {s.category ? ` — ${s.category}` : ''}
        </option>
      ))}
    </>
  );
}

function SelectIndicator({ isLoading }: { isLoading: boolean }) {
  return (
    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 opacity-50">
      {isLoading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </span>
  );
}

export function SubjectSelector({
  subjects,
  selectedSubjectSlug,
  isLoadingSubject,
  onChange,
}: SubjectSelectorProps) {
  return (
    <div className="card border border-(--foreground)/10">
      <label className="mb-2 block text-sm font-bold tracking-widest uppercase opacity-70">
        Matéria
      </label>
      <div className="relative">
        <select
          value={selectedSubjectSlug}
          onChange={onChange}
          disabled={isLoadingSubject}
          className={`input appearance-none pr-10 font-semibold transition-all duration-200 ${isLoadingSubject ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <SubjectOptions subjects={subjects} />
        </select>
        <SelectIndicator isLoading={isLoadingSubject} />
      </div>
    </div>
  );
}
