'use client';

import { FormToggleButton } from '@/src/web/components';

import { useMockExamToggle } from './_hooks';

export function MockExamToggleButton() {
  const { isOpen, toggle } = useMockExamToggle();

  return (
    <FormToggleButton
      isOpen={isOpen}
      createLabel="Novo Simulado"
      onClick={toggle}
    />
  );
}
