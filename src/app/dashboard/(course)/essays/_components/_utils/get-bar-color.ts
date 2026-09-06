const INSUFFICIENT_MAX = 80;
const REGULAR_MAX = 120;
const DECENT_MAX = 160;
const VERY_GOOD_MAX = 180;

type CompetencyColor =
  | '--perf-insufficient'
  | '--perf-regular'
  | '--perf-decent'
  | '--perf-very-good'
  | '--perf-excellent';

export function getCompetencyBarColor(average: number): CompetencyColor {
  if (average <= INSUFFICIENT_MAX) return '--perf-insufficient';
  if (average < REGULAR_MAX) return '--perf-regular';
  if (average < DECENT_MAX) return '--perf-decent';
  if (average < VERY_GOOD_MAX) return '--perf-very-good';

  return '--perf-excellent';
}
