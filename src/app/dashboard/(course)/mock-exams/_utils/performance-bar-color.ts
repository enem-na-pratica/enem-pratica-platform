type PerformanceColor =
  | '--perf-insufficient'
  | '--perf-regular'
  | '--perf-decent'
  | '--perf-very-good'
  | '--perf-excellent';

const RATE_THRESHOLDS = [
  { max: 60, color: '--perf-insufficient' },
  { max: 75, color: '--perf-regular' },
  { max: 85, color: '--perf-decent' },
  { max: 90, color: '--perf-very-good' },
  { max: Infinity, color: '--perf-excellent' },
] as const;

export function getPerformanceBarColor(rate: number): PerformanceColor {
  return RATE_THRESHOLDS.find((t) => rate <= t.max)!.color;
}
