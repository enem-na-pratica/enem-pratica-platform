const INSUFFICIENT_MAX = 60;
const REGULAR_MAX = 75;
const DECENT_MAX = 85;
const VERY_GOOD_MAX = 90;

type PerformanceColor =
  | '--perf-insufficient'
  | '--perf-regular'
  | '--perf-decent'
  | '--perf-very-good'
  | '--perf-excellent';

export function getPerformanceBarColor(rate: number): PerformanceColor {
  if (rate <= INSUFFICIENT_MAX) return '--perf-insufficient';
  if (rate <= REGULAR_MAX) return '--perf-regular';
  if (rate <= DECENT_MAX) return '--perf-decent';
  if (rate <= VERY_GOOD_MAX) return '--perf-very-good';

  return '--perf-excellent';
}
