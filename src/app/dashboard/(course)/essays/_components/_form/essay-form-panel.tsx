'use client';

import { useNotify } from '@/src/web/hooks';
import type { CreateEssayFormValues } from '@/src/web/validation';

import { createEssayAction } from '../../actions';
import { useEssayForm, useEssayToggle } from './_hooks';
import { EssayForm } from './essay-form';

type EssayFormPanelProps = {
  targetUsername?: string;
};

export function EssayFormPanel({ targetUsername }: EssayFormPanelProps) {
  const { isOpen, close } = useEssayToggle();
  const form = useEssayForm();
  const { notify } = useNotify();

  if (!isOpen) return null;

  const onSubmit = async (data: CreateEssayFormValues) => {
    try {
      await createEssayAction({ data, targetUsername });
      notify({
        message: 'Redação salva com sucesso!',
        type: 'success',
        duration: 3000,
      });
      form.resetForm();
      close();
    } catch {
      // console.error(error);
      notify({ message: 'Erro ao salvar redação!', type: 'error' });
    }
  };

  return (
    <EssayForm
      form={form}
      onSubmit={onSubmit}
    />
  );
}
