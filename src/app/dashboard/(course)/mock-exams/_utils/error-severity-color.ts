const EXCELLENT_MAX_ERRORS = 3;
const VERY_GOOD_MAX_ERRORS = 8;
const DECENT_MAX_ERRORS = 15;
const REGULAR_MAX_ERRORS = 25;

type PerformanceColor =
  | '--perf-insufficient'
  | '--perf-regular'
  | '--perf-decent'
  | '--perf-very-good'
  | '--perf-excellent';

export function getErrorSeverityColor(
  value: number,
): `text-[var(${PerformanceColor})]` {
  if (value <= EXCELLENT_MAX_ERRORS) return 'text-[var(--perf-excellent)]';
  if (value <= VERY_GOOD_MAX_ERRORS) return 'text-[var(--perf-very-good)]';
  if (value <= DECENT_MAX_ERRORS) return 'text-[var(--perf-decent)]';
  if (value <= REGULAR_MAX_ERRORS) return 'text-[var(--perf-regular)]';

  return 'text-[var(--perf-insufficient)]';
}
