import {
  type Control,
  Controller,
  type FieldError as RHFFieldError,
} from 'react-hook-form';

import type { Topic } from '@/src/web/api';
import { DropdownIndicator } from '@/src/web/components';
import type { CreateQuestionSessionFormValues } from '@/src/web/validation';

import { FieldError } from './field-error';

type TopicSelectProps = {
  control: Control<CreateQuestionSessionFormValues>;
  error?: RHFFieldError;
  topics: Topic[];
  isLoadingTopics: boolean;
  selectedSubjectSlug: string;
};

export function TopicSelect({
  control,
  error,
  topics,
  isLoadingTopics,
  selectedSubjectSlug,
}: TopicSelectProps) {
  const isDisabled = isLoadingTopics || topics.length === 0;
  const hasError = !!error;

  return (
    <div className="flex-1">
      <TopicLabel hasError={hasError} />
      <div className="relative">
        <TopicController
          control={control}
          isDisabled={isDisabled}
          hasError={hasError}
          topics={topics}
          isLoadingTopics={isLoadingTopics}
          selectedSubjectSlug={selectedSubjectSlug}
        />
        <DropdownIndicator />
      </div>
      <FieldError message={error?.message} />
    </div>
  );
}

function TopicController({
  control,
  isDisabled,
  hasError,
  topics,
  isLoadingTopics,
  selectedSubjectSlug,
}: {
  control: Control<CreateQuestionSessionFormValues>;
  isDisabled: boolean;
  hasError: boolean;
  topics: Topic[];
  isLoadingTopics: boolean;
  selectedSubjectSlug: string;
}) {
  return (
    <Controller
      control={control}
      name="topicId"
      render={({ field }) => (
        <select
          {...field}
          disabled={isDisabled}
          className={getSelectStyles({ isDisabled, hasError })}
        >
          <TopicOptions
            topics={topics}
            placeholderProps={{
              selectedSubjectSlug,
              isLoadingTopics,
              hasTopics: topics.length > 0,
            }}
          />
        </select>
      )}
    />
  );
}

function TopicLabel({ hasError }: { hasError: boolean }) {
  return (
    <label
      className={`mb-1 block text-sm font-bold transition-colors ${
        hasError ? 'text-(--error)' : 'opacity-70'
      }`}
    >
      Assunto
    </label>
  );
}

function getSelectStyles({
  hasError,
  isDisabled,
}: {
  isDisabled: boolean;
  hasError: boolean;
}) {
  const base =
    'input appearance-none pr-10 font-semibold transition-all duration-200';
  const stateClass = isDisabled
    ? 'cursor-not-allowed opacity-50'
    : 'cursor-pointer';
  const errorClass = hasError
    ? 'animate-shake border-(--error) ring-1 ring-(--error)'
    : '';
  return `${base} ${stateClass} ${errorClass}`;
}

function TopicOptions({
  topics,
  placeholderProps,
}: {
  topics: Topic[];
  placeholderProps: PlaceholderState;
}) {
  return (
    <>
      <option
        value=""
        disabled
      >
        {getTopicPlaceholder(placeholderProps)}
      </option>
      {topics.map((t) => (
        <option
          key={t.id}
          value={t.id}
        >
          {t.position}. {t.title}
        </option>
      ))}
    </>
  );
}

type PlaceholderState = {
  selectedSubjectSlug: string;
  isLoadingTopics: boolean;
  hasTopics: boolean;
};

function getTopicPlaceholder({
  selectedSubjectSlug,
  isLoadingTopics,
  hasTopics,
}: PlaceholderState) {
  if (!selectedSubjectSlug) return '— Selecione uma matéria primeiro —';
  if (isLoadingTopics) return 'Carregando...';
  if (!hasTopics) return 'Nenhum assunto encontrado';
  return '— Selecione um assunto —';
}
