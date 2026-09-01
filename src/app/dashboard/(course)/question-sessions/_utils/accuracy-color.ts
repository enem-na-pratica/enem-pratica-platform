import { PERFORMANCE_COLORS } from '@/src/web/config';

const LOW_ACCURACY_THRESHOLD = 40;
const MEDIUM_LOW_ACCURACY_THRESHOLD = 60;
const MEDIUM_ACCURACY_THRESHOLD = 75;
const HIGH_ACCURACY_THRESHOLD = 90;

export function getAccuracyColor(accuracyPercentage: number): string {
  if (accuracyPercentage < LOW_ACCURACY_THRESHOLD)
    return PERFORMANCE_COLORS.INSUFFICIENT;
  if (accuracyPercentage < MEDIUM_LOW_ACCURACY_THRESHOLD)
    return PERFORMANCE_COLORS.REGULAR;
  if (accuracyPercentage < MEDIUM_ACCURACY_THRESHOLD)
    return PERFORMANCE_COLORS.DECENT;
  if (accuracyPercentage < HIGH_ACCURACY_THRESHOLD)
    return PERFORMANCE_COLORS.VERY_GOOD;
  return PERFORMANCE_COLORS.EXCELLENT;
}
