'use client';

import type { Subject } from '@/src/web/api';
import { FormSubmitButton } from '@/src/web/components';
import type { CreateQuestionSessionFormValues } from '@/src/web/validation';

import { useCascadingTopics, useQuestionSessionForm } from './_hooks';
import { DateField } from './date-field';
import { IsReviewedCheckbox } from './is-reviewed-checkbox';
import { LivePreview } from './live-preview';
import { NumberField } from './number-field';
import { SubjectSelect } from './subject-select';
import { TopicSelect } from './topic-select';

type QuestionSessionFormProps = {
  form: ReturnType<typeof useQuestionSessionForm>;
  topicsHook: ReturnType<typeof useCascadingTopics>;
  subjects: Subject[];
  onSubmit: (data: CreateQuestionSessionFormValues) => Promise<void>;
};

export function QuestionSessionForm({
  form,
  topicsHook,
  subjects,
  onSubmit,
}: QuestionSessionFormProps) {
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="card animate-in zoom-in-95 space-y-6 overflow-hidden border-2 border-(--accent) duration-300"
    >
      <h3 className="text-base font-bold tracking-widest uppercase opacity-70">
        Nova Sessão de Questões
      </h3>

      <FormTopRow
        subjects={subjects}
        form={form}
        topicsHook={topicsHook}
      />
      <FormBottomRow form={form} />
    </form>
  );
}

function FormTopRow({
  subjects,
  form,
  topicsHook,
}: {
  subjects: Subject[];
  form: ReturnType<typeof useQuestionSessionForm>;
  topicsHook: ReturnType<typeof useCascadingTopics>;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <SubjectSelect
        subjects={subjects}
        value={topicsHook.selectedSubjectSlug}
        isLoading={topicsHook.isLoadingTopics}
        onChange={topicsHook.handleSubjectChange}
      />
      <TopicSelect
        control={form.control}
        error={form.formState.errors.topicId}
        topics={topicsHook.topics}
        isLoadingTopics={topicsHook.isLoadingTopics}
        selectedSubjectSlug={topicsHook.selectedSubjectSlug}
      />
      <DateField
        today={form.today}
        error={form.formState.errors.date}
        register={form.register}
      />
    </div>
  );
}

function FormBottomRow({
  form,
}: {
  form: ReturnType<typeof useQuestionSessionForm>;
}) {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
      <NumberField
        label="Total"
        name="total"
        error={form.formState.errors.total}
        register={form.register}
        min={1}
      />
      <NumberField
        label="Correto"
        name="correct"
        error={form.formState.errors.correct}
        register={form.register}
      />
      <LivePreview
        correct={form.correct}
        total={form.total}
      />
      <IsReviewedCheckbox register={form.register} />
      <FormSubmitButton
        isSubmitting={form.formState.isSubmitting}
        isValid={form.formState.isValid}
      />
    </div>
  );
}
