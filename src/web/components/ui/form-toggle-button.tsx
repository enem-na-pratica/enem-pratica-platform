type ToggleButtonProps = {
  isOpen: boolean;
  onClick: () => void;
  createLabel: string;
  cancelLabel?: string;
};

export function FormToggleButton({
  isOpen,
  onClick,
  createLabel,
  cancelLabel = 'Cancelar',
}: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="button-primary mb-4 flex items-center gap-2 shadow-(--accent)/20 shadow-lg"
    >
      <span>{isOpen ? cancelLabel : createLabel}</span>
      {!isOpen && <span>+</span>}
    </button>
  );
}
