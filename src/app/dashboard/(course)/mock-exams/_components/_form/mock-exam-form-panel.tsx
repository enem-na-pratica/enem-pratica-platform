'use client';

import { useNotify } from '@/src/web/hooks';
import type { CreateMockExamFormValues } from '@/src/web/validation';

import { createMockExamAction } from '../../actions';
import { useMockExamForm, useMockExamToggle } from './_hooks';
import { MockExamForm } from './mock-exam-form';

type MockExamFormPanelProps = {
  username?: string;
};

export function MockExamFormPanel({ username }: MockExamFormPanelProps) {
  const { isOpen } = useMockExamToggle();
  const form = useMockExamForm();
  const { notify } = useNotify();

  if (!isOpen) return null;

  const onSubmit = async (data: CreateMockExamFormValues) => {
    try {
      await createMockExamAction({ data, targetUsername: username });
      notify({
        message: 'Simulado salvo com sucesso!',
        type: 'success',
        duration: 3000,
      });
      form.resetForm();
    } catch {
      notify({ message: 'Erro ao registrar simulado!', type: 'error' });
    }
  };

  const onReset = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados?')) {
      form.resetForm();
    }
  };

  return (
    <MockExamForm
      form={form}
      onSubmit={onSubmit}
      onReset={onReset}
    />
  );
}
