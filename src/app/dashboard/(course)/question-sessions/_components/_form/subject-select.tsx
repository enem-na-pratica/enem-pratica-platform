import type { ChangeEvent } from 'react';

import type { Subject } from '@/src/web/api';
import { DropdownIndicator } from '@/src/web/components';

type SubjectSelectProps = {
  subjects: Subject[];
  value: string;
  isLoading: boolean;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export function SubjectSelect({
  subjects,
  value,
  isLoading,
  onChange,
}: SubjectSelectProps) {
  return (
    <div className="flex-1">
      <label className="mb-1 block text-sm font-bold opacity-70">Matéria</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={isLoading}
          className={`input appearance-none pr-10 font-semibold transition-all duration-200 ${
            isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
        >
          <option
            value=""
            disabled
          >
            — Selecione uma matéria —
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
        </select>
        <DropdownIndicator isLoading={isLoading} />
      </div>
    </div>
  );
}
