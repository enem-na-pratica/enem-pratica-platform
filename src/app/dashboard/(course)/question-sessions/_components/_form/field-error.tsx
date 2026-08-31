type FieldErrorProps = {
  message?: string;
};

export function FieldError({ message }: FieldErrorProps) {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${
        message ? 'mt-1 max-h-10' : 'max-h-0'
      }`}
    >
      <p className="text-xs font-medium text-(--error) italic">{message}</p>
    </div>
  );
}
