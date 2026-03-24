'use client';

import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';

import { zodResolver } from '@hookform/resolvers/zod';

import { Subject, Topic } from '@/src/web/api';
import {
  CreateQuestionSessionFormValues,
  createQuestionSessionSchema,
} from '@/src/web/validation';

import { createQuestionSessionAction } from '../actions';
import { fetchTopicsBySubject } from '../api';
import { ChevronIcon, SpinnerIcon } from './icons';

type EssayFormProps = {
  targetUsername: string;
  subjects: Subject[];
};

export function QuestionSessionForm({
  subjects,
  targetUsername,
}: EssayFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Cascading select state
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateQuestionSessionFormValues>({
    resolver: zodResolver(createQuestionSessionSchema),
    mode: 'onChange',
    defaultValues: {
      topicId: '',
      date: new Date().toISOString().slice(0, 10),
      total: 10,
      correct: 0,
      isReviewed: false,
    },
  });

  const total = useWatch({ control, name: 'total' }) ?? 0;
  const correct = useWatch({ control, name: 'correct' }) ?? 0;
  const incorrect = Math.max(0, Number(total) - Number(correct));
  const performance =
    Number(total) > 0
      ? ((Number(correct) / Number(total)) * 100).toFixed(0)
      : '—';

  const handleSubjectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const slug = e.target.value;
    setSelectedSubjectSlug(slug);
    setTopics([]);
    setValue('topicId', '');

    if (!slug) return;

    setIsLoadingTopics(true);
    try {
      const data = await fetchTopicsBySubject({
        subjectSlug: slug,
        targetUsername: targetUsername,
      });
      // fetchTopicsBySubject returns TopicProgress[]; we only need the topic shape
      setTopics(data.map((tp) => tp.topic));
    } catch {
      toast.error('Erro ao carregar assuntos.');
    } finally {
      setIsLoadingTopics(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedSubjectSlug('');
    setTopics([]);
    reset({
      topicId: '',
      date: new Date().toISOString().slice(0, 10),
      total: 10,
      correct: 0,
      isReviewed: false,
    });
  };

  const onSubmit = async (data: CreateQuestionSessionFormValues) => {
    try {
      await createQuestionSessionAction({ data, targetUsername });
      toast.success('Sessão registrada com sucesso!');
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao registrar sessão.');
    }
  };

  return (
    <div>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
        className="button-primary mb-4 flex items-center gap-2 shadow-(--accent)/20 shadow-lg"
      >
        <span>{isOpen ? 'Cancelar' : 'Nova Sessão'}</span>
        {!isOpen && <span>+</span>}
      </button>

      {/* Collapsible form */}
      {isOpen && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card animate-in zoom-in-95 space-y-6 overflow-hidden border-2 border-(--accent) duration-300"
        >
          <h3 className="text-base font-bold tracking-widest uppercase opacity-70">
            Nova Sessão de Questões
          </h3>

          {/* Row 1: Subject select + Topic select + Date */}
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Subject selector */}
            <div className="flex-1">
              <label className="mb-1 block text-sm font-bold opacity-70">
                Matéria
              </label>
              <div className="relative">
                <select
                  value={selectedSubjectSlug}
                  onChange={handleSubjectChange}
                  disabled={isLoadingTopics}
                  className={`input appearance-none pr-10 font-semibold transition-all duration-200 ${
                    isLoadingTopics
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer'
                  }`}
                >
                  <option
                    value=""
                    disabled
                  >
                    — Selecione uma matéria —
                  </option>
                  {subjects.map((s) => (
                    <option
                      key={s.id}
                      value={s.slug}
                    >
                      {s.name}
                      {s.category ? ` — ${s.category}` : ''}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 opacity-50">
                  {isLoadingTopics ? <SpinnerIcon /> : <ChevronIcon />}
                </span>
              </div>
            </div>

            {/* Topic selector */}
            <div className="flex-1">
              <label
                className={`mb-1 block text-sm font-bold transition-colors ${
                  errors.topicId ? 'text-(--error)' : 'opacity-70'
                }`}
              >
                Assunto
              </label>
              <div className="relative">
                <Controller
                  control={control}
                  name="topicId"
                  render={({ field }) => (
                    <select
                      {...field}
                      disabled={isLoadingTopics || topics.length === 0}
                      className={`input appearance-none pr-10 font-semibold transition-all duration-200 ${
                        isLoadingTopics || topics.length === 0
                          ? 'cursor-not-allowed opacity-50'
                          : 'cursor-pointer'
                      } ${
                        errors.topicId
                          ? 'animate-shake border-(--error) ring-1 ring-(--error)'
                          : ''
                      }`}
                    >
                      <option
                        value=""
                        disabled
                      >
                        {isLoadingTopics
                          ? 'Carregando...'
                          : !selectedSubjectSlug
                            ? '— Selecione uma matéria primeiro —'
                            : topics.length === 0
                              ? 'Nenhum assunto encontrado'
                              : '— Selecione um assunto —'}
                      </option>
                      {topics.map((t) => (
                        <option
                          key={t.id}
                          value={t.id}
                        >
                          {t.position}. {t.title}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 opacity-50">
                  <ChevronIcon />
                </span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  errors.topicId ? 'mt-1 max-h-10' : 'max-h-0'
                }`}
              >
                <p className="text-xs font-medium text-(--error) italic">
                  {errors.topicId?.message}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="w-full lg:w-48">
              <label
                className={`mb-1 block text-sm font-bold transition-colors ${
                  errors.date ? 'text-(--error)' : 'opacity-70'
                }`}
              >
                Data
              </label>
              <input
                type="date"
                className={`input transition-all ${
                  errors.date
                    ? 'animate-shake border-(--error) ring-1 ring-(--error)'
                    : ''
                }`}
                {...register('date')}
              />
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  errors.date ? 'mt-1 max-h-10' : 'max-h-0'
                }`}
              >
                <p className="text-xs font-medium text-(--error) italic">
                  {errors.date?.message}
                </p>
              </div>
            </div>
          </div>

          {/* Row 2: Total + Correct + live preview + checkbox + submit */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            {/* Total */}
            <div className="w-full sm:w-32">
              <label
                className={`mb-1 block text-sm font-bold transition-colors ${
                  errors.total ? 'text-(--error)' : 'opacity-70'
                }`}
              >
                Total
              </label>
              <input
                type="number"
                min="1"
                className={`input text-center font-mono font-bold transition-all ${
                  errors.total
                    ? 'animate-shake border-(--error) text-(--error) ring-1 ring-(--error)'
                    : ''
                }`}
                {...register('total', { valueAsNumber: true })}
              />
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  errors.total ? 'mt-1 max-h-10' : 'max-h-0'
                }`}
              >
                <p className="text-xs font-medium text-(--error) italic">
                  {errors.total?.message}
                </p>
              </div>
            </div>

            {/* Correct */}
            <div className="relative w-full sm:w-32">
              <label
                className={`mb-1 block text-sm font-bold transition-colors ${
                  errors.correct ? 'text-(--error)' : 'text-green-500'
                }`}
              >
                Acertos
              </label>
              <input
                type="number"
                min="0"
                className={`input border-green-500/40 text-center font-mono font-bold transition-all ${
                  errors.correct
                    ? 'animate-shake border-(--error) text-(--error) ring-1 ring-(--error)'
                    : 'focus:border-green-500'
                }`}
                {...register('correct', { valueAsNumber: true })}
              />
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  errors.correct ? 'mt-1 max-h-10' : 'max-h-0'
                }`}
              >
                <p className="text-xs font-medium text-(--error) italic">
                  {errors.correct?.message}
                </p>
              </div>
            </div>

            {/* Live preview */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-(--foreground)/10 bg-(--foreground)/5 px-4 py-3 sm:ml-2">
              <div className="text-center">
                <p className="text-[10px] font-bold tracking-widest uppercase opacity-40">
                  Erros
                </p>
                <p className="text-xl font-black text-(--error)">{incorrect}</p>
              </div>
              <div className="hidden h-8 w-px bg-(--foreground)/10 sm:block" />
              <div className="text-center">
                <p className="text-[10px] font-bold tracking-widest uppercase opacity-40">
                  Rendimento
                </p>
                <p className="text-xl font-black text-(--accent)">
                  {performance}%
                </p>
              </div>
            </div>

            {/* Is Reviewed checkbox */}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="button-primary h-[42px] w-full whitespace-nowrap transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
