import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import type { CompetencyKey } from '@/src/web/api/modules';
import type { CreateEssayFormValues } from '@/src/web/validation';

import { CompetencyField } from './competency-field';

const COMPETENCIES: CompetencyKey[] = ['c1', 'c2', 'c3', 'c4', 'c5'];

type CompetencyGridProps = {
  errors: FieldErrors<CreateEssayFormValues>['grades'];
  register: UseFormRegister<CreateEssayFormValues>;
};

export function CompetencyGrid({ errors, register }: CompetencyGridProps) {
  return (
    <div className="flex w-full flex-wrap items-end gap-4 sm:flex-nowrap lg:w-auto">
      <div className="flex gap-2">
        {COMPETENCIES.map((key) => (
          <CompetencyField
            key={key}
            name={key}
            error={errors?.[key]}
            register={register}
          />
        ))}
      </div>
    </div>
  );
}
