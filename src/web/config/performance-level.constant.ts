export const PERFORMANCE_COLORS = {
  INSUFFICIENT: 'hsl(0, 84%, 60%)', // Red
  REGULAR: 'hsl(35, 90%, 55%)', // Orange/Amber
  DECENT: 'hsl(50, 90%, 50%)', // Yellow
  VERY_GOOD: 'hsl(100, 70%, 45%)', // Lime Green
  EXCELLENT: 'hsl(140, 70%, 40%)', // Strong Green
} as const;

export type PerformanceColor =
  (typeof PERFORMANCE_COLORS)[keyof typeof PERFORMANCE_COLORS];
