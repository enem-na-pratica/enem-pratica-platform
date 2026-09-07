import toast from 'react-hot-toast';

import { NotificationToast } from '@/src/web/components';

const DEFAULT_TOAST_DURATION = 5000;

type NotifyParams = {
  /** The visual variant and context of the notification. */
  type: 'success' | 'error';
  /** The main header or concise summary of the notification. */
  message: string;
  /** Optional secondary text providing additional details. */
  description?: string;
  /**
   * Display duration in milliseconds.
   * @default 5000
   */
  duration?: number;
};

/**
 * Custom hook to trigger standardized UI toast notifications.
 *
 * Encapsulates `react-hot-toast` with the application's `NotificationToast` component.
 *
 * @example
 * ```tsx
 * const { notify } = useNotify();

 * // Basic success toast
 * notify({
 *   type: 'success',
 *   message: 'Changes saved successfully',
 * });

 * // Error toast with optional description and custom duration
 * notify({
 *   type: 'error',
 *   message: 'Failed to update profile',
 *   description: 'Please check your network connection and try again.',
 *   duration: 8000,
 * });
 * ```
 */
export function useNotify() {
  const notify = ({
    type,
    message,
    description,
    duration = DEFAULT_TOAST_DURATION,
  }: NotifyParams) => {
    toast.custom(
      (t) => (
        <NotificationToast
          visible={t.visible}
          type={type}
          message={message}
          description={description}
          onClose={() => toast.dismiss(t.id)}
        />
      ),
      { duration },
    );
  };

  return { notify };
}
