'use client';

import { FormToggleButton } from '@/src/web/components';

import { useEssayToggle } from './_hooks';

export function EssayToggleButton() {
  const { isOpen, toggle } = useEssayToggle();

  return (
    <FormToggleButton
      isOpen={isOpen}
      createLabel="Nova Redação"
      onClick={toggle}
    />
  );
}
