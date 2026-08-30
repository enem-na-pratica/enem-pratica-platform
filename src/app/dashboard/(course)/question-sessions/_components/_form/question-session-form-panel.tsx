'use client';

import type { Subject } from '@/src/web/api';
import { useNotify } from '@/src/web/hooks';
import type { CreateQuestionSessionFormValues } from '@/src/web/validation';

import { createQuestionSessionAction } from '../../actions';
import { useCascadingTopics, useQuestionSessionForm } from './_hooks';
import { useQuestionSessionToggle } from './_hooks';
import { QuestionSessionForm } from './question-session-form';

type QuestionSessionFormPanelProps = {
  targetUsername?: string;
  subjects: Subject[];
};

export function QuestionSessionFormPanel({
  subjects,
  targetUsername,
}: QuestionSessionFormPanelProps) {
  const { isOpen, close } = useQuestionSessionToggle();
  const { notify } = useNotify();

  const form = useQuestionSessionForm();
  const topicsHook = useCascadingTopics({
    targetUsername,
    onSubjectReset: (topicId) => form.setValue('topicId', topicId),
  });

  if (!isOpen) return null;

  const onSubmit = async (data: CreateQuestionSessionFormValues) => {
    try {
      await createQuestionSessionAction({ data, targetUsername });
      notify({
        message: 'Sessão registrada com sucesso!',
        type: 'success',
        duration: 3000,
      });
      close();
      topicsHook.resetTopics();
      form.resetForm();
    } catch (error) {
      console.error(error);
      notify({ message: 'Erro ao registrar sessão!', type: 'error' });
    }
  };

  return (
    <QuestionSessionForm
      form={form}
      topicsHook={topicsHook}
      subjects={subjects}
      onSubmit={onSubmit}
    />
  );
}
