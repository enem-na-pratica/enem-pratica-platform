type SubmitButtonProps = {
  isSubmitting: boolean;
  isValid: boolean;
  label?: string;
  loadingLabel?: string;
};

export function FormSubmitButton({
  isSubmitting,
  isValid,
  label = 'Salvar',
  loadingLabel = 'Salvando...',
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={!isValid || isSubmitting}
      className="button-primary h-[42px] w-full whitespace-nowrap transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {isSubmitting ? loadingLabel : label}
    </button>
  );
}
