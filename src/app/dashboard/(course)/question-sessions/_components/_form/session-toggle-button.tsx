'use client';

import { FormToggleButton } from '@/src/web/components';

import { useQuestionSessionToggle } from './_hooks';

export function SessionToggleButton() {
  const { isOpen, toggle } = useQuestionSessionToggle();

  return (
    <FormToggleButton
      isOpen={isOpen}
      createLabel="Nova Sessão"
      onClick={toggle}
    />
  );
}
