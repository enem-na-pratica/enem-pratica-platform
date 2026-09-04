type PerformanceColor =
  | '--perf-insufficient'
  | '--perf-regular'
  | '--perf-decent'
  | '--perf-very-good'
  | '--perf-excellent';

const ERROR_THRESHOLDS = [
  { max: 3, color: 'text-[var(--perf-excellent)]' }, // Excellent
  { max: 8, color: 'text-[var(--perf-very-good)]' }, // Very Good
  { max: 15, color: 'text-[var(--perf-decent)]' }, // Attention
  { max: 25, color: 'text-[var(--perf-regular)]' }, // Concerning
  { max: Infinity, color: 'text-[var(--perf-insufficient)]' }, // Critical (collapse zone)
] as const;

export function getErrorSeverityColor(
  value: number,
): `text-[var(${PerformanceColor})]` {
  return ERROR_THRESHOLDS.find((t) => value <= t.max)!.color;
}
