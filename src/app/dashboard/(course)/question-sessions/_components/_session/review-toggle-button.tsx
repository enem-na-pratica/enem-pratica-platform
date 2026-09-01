import { CheckCircle, CircleDashed, LoaderCircle } from 'lucide-react';

type ReviewToggleButtonProps = {
  isReviewed: boolean;
  isUpdating: boolean;
  onToggle: () => void;
};

export function ReviewToggleButton({
  isReviewed,
  isUpdating,
  onToggle,
}: ReviewToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isUpdating}
      title={isReviewed ? 'Marcar como não revisado' : 'Marcar como revisado'}
      className={`relative flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all duration-200 select-none ${isUpdating ? 'cursor-not-allowed opacity-50' : ''} ${
        isReviewed
          ? 'border-green-500/30 bg-green-500/10 text-green-500 hover:bg-green-500/20'
          : 'border-(--foreground)/10 bg-(--foreground)/5 opacity-60 hover:border-(--foreground)/20 hover:opacity-100'
      }`}
    >
      <ReviewToggleIcon
        isUpdating={isUpdating}
        isReviewed={isReviewed}
      />
      <ReviewText
        isUpdating={isUpdating}
        isReviewed={isReviewed}
      />
    </button>
  );
}

function ReviewToggleIcon({
  isUpdating,
  isReviewed,
}: {
  isUpdating: boolean;
  isReviewed: boolean;
}) {
  if (isUpdating) return <LoaderCircle className="h-4 w-4 animate-spin" />;
  if (isReviewed) return <CheckCircle className="h-4 w-4" />;
  return <CircleDashed className="h-4 w-4" />;
}

type ReviewState = 'updating' | 'reviewed' | 'pending';

type ReviewTextProps = {
  isUpdating: boolean;
  isReviewed: boolean;
};

function ReviewText({ isUpdating, isReviewed }: ReviewTextProps) {
  const currentState = getReviewState({ isUpdating, isReviewed });

  const labels: Record<ReviewState, string> = {
    updating: 'Atualizando...',
    reviewed: 'Revisado',
    pending: 'Revisar',
  };

  return <span>{labels[currentState]}</span>;
}

function getReviewState({
  isUpdating,
  isReviewed,
}: ReviewTextProps): ReviewState {
  if (isUpdating) return 'updating';
  if (isReviewed) return 'reviewed';
  return 'pending';
}
