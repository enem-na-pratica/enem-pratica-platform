import { ChevronDown, LoaderCircle } from 'lucide-react';

type SelectorIndicatorProps = {
  isLoading?: boolean;
};

export function DropdownIndicator({
  isLoading = false,
}: SelectorIndicatorProps) {
  return (
    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 opacity-50">
      {isLoading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </span>
  );
}
