const LOW_ACCURACY_THRESHOLD = 40;
const MEDIUM_LOW_ACCURACY_THRESHOLD = 60;
const MEDIUM_ACCURACY_THRESHOLD = 75;
const HIGH_ACCURACY_THRESHOLD = 90;

type PerformanceColor =
  | '--perf-insufficient'
  | '--perf-regular'
  | '--perf-decent'
  | '--perf-very-good'
  | '--perf-excellent';

export function getAccuracyColor(
  accuracyPercentage: number,
): `bg-[var(${PerformanceColor})]` {
  if (accuracyPercentage < LOW_ACCURACY_THRESHOLD)
    return 'bg-[var(--perf-insufficient)]';

  if (accuracyPercentage < MEDIUM_LOW_ACCURACY_THRESHOLD)
    return 'bg-[var(--perf-regular)]';

  if (accuracyPercentage < MEDIUM_ACCURACY_THRESHOLD)
    return 'bg-[var(--perf-decent)]';

  if (accuracyPercentage < HIGH_ACCURACY_THRESHOLD)
    return 'bg-[var(--perf-very-good)]';

  return 'bg-[var(--perf-excellent)]';
}
