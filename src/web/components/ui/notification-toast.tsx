import { CheckCircle, X, XCircle } from 'lucide-react';

type NotificationToastProps = {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
  description?: string;
  onClose: () => void;
};

export function NotificationToast({
  visible,
  type,
  message,
  description,
  onClose,
}: NotificationToastProps) {
  return (
    <div
      className={`${
        visible
          ? 'animate-in fade-in slide-in-from-right-5'
          : 'animate-out fade-out slide-out-to-right-5'
      } w-full max-w-md border-l-4 ${
        type === 'success' ? 'border-(--success)' : 'border-(--error)'
      } pointer-events-auto flex overflow-hidden rounded-lg bg-(--card-background) shadow-2xl ring-1 ring-black/5`}
    >
      <div className="flex-1 p-4">
        <div className="flex items-start">
          <div className="shrink-0 pt-0.5">
            {type === 'success' ? (
              <CheckCircle className="h-10 w-10 text-(--success)" />
            ) : (
              <XCircle className="h-10 w-10 text-(--error)" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-bold tracking-wide text-(--foreground) uppercase">
              {type === 'success' ? 'Sucesso!' : 'Ocorreu um erro'}
            </p>
            <p className="mt-1 text-sm text-(--foreground) opacity-90">
              {message}
            </p>
            {description && (
              <p className="mt-1 text-xs text-(--foreground) italic opacity-60">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-l border-(--foreground)/10">
        <button
          onClick={onClose}
          className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-(--accent) hover:opacity-70 focus:outline-none"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
