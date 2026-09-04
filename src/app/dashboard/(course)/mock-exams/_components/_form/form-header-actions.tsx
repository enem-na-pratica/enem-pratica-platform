import { FormSubmitButton } from '@/src/web/components';

type FormHeaderActionsProps = {
  isSubmitting: boolean;
  isValid: boolean;
  onReset: () => void;
};

export function FormHeaderActions({
  isSubmitting,
  isValid,
  onReset,
}: FormHeaderActionsProps) {
  return (
    <div className="flex items-center justify-between border-b border-(--foreground)/10 pb-4">
      <h2 className="text-xl font-bold">Novo Simulado</h2>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-(--foreground)/60 transition-colors hover:text-(--error)"
        >
          Limpar
        </button>

        <FormSubmitButton
          isSubmitting={isSubmitting}
          isValid={isValid}
        />
      </div>
    </div>
  );
}
