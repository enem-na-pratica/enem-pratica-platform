import type { UseFormRegister } from 'react-hook-form';

import type { CreateQuestionSessionFormValues } from '@/src/web/validation';

type IsReviewedCheckboxProps = {
  register: UseFormRegister<CreateQuestionSessionFormValues>;
};

export function IsReviewedCheckbox({ register }: IsReviewedCheckboxProps) {
  return (
    <div className="flex items-center gap-2 pb-1 sm:ml-auto">
      <input
        type="checkbox"
        id="isReviewed"
        className="h-4 w-4 cursor-pointer rounded accent-(--accent)"
        {...register('isReviewed')}
      />
      <label
        htmlFor="isReviewed"
        className="cursor-pointer text-sm font-semibold opacity-70 select-none"
      >
        Já revisado
      </label>
    </div>
  );
}
