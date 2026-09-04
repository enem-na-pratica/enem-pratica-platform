import type {
  AreaCalculatedValues,
  AreaInputValues,
} from './_utils/calculate-area-stats';

const PERCENTAGE_MULTIPLIER = 100;

type AreaPerformanceTotalsRowProps = {
  totalCorrect: number;
  globalPerformance: number;
  calculateTotalInput: (field: keyof AreaInputValues) => number;
  calculateTotalCalculated: (field: keyof AreaCalculatedValues) => number;
};

export function AreaPerformanceTotalsRow({
  totalCorrect,
  globalPerformance,
  calculateTotalInput,
  calculateTotalCalculated,
}: AreaPerformanceTotalsRowProps) {
  const totalCertainty = calculateTotalInput('certaintyCount');
  const certaintyRate = calculateCertaintyRate(totalCertainty, totalCorrect);

  return (
    <tr className="border-t-2 border-(--foreground)/20 bg-(--foreground)/10 font-black">
      <td className="px-2 py-3 text-left text-xs uppercase">TOTAL</td>
      <td className="p-1 text-(--success)">{totalCorrect}</td>
      <td className="p-1 text-(--error)">
        {calculateTotalCalculated('wrongAnswers')}
      </td>
      <td className="p-1 text-sm">{globalPerformance.toFixed(0)}%</td>
      <td className="p-1 text-(--success)">{totalCertainty}</td>
      <td className="p-1 text-xs opacity-70">{certaintyRate.toFixed(0)}%</td>
      <td className="p-1 text-yellow-600 opacity-70 dark:text-yellow-400">
        {calculateTotalCalculated('doubtHits')}
      </td>
      <td className="p-1 text-yellow-600 dark:text-yellow-400">
        {calculateTotalInput('doubtErrors')}
      </td>
      <td className="p-1 text-(--error)">
        {calculateTotalCalculated('criticalErrors')}
      </td>
      <td className="p-1 text-orange-600 dark:text-orange-400">
        {calculateTotalInput('distractionErrors')}
      </td>
      <td className="p-1 text-orange-600 dark:text-orange-400">
        {calculateTotalInput('interpretationErrors')}
      </td>
      <td className="p-1 text-orange-600 dark:text-orange-400">
        {calculateTotalCalculated('knowledgeGaps')}
      </td>
    </tr>
  );
}

function calculateCertaintyRate(
  totalCertainty: number,
  totalCorrect: number,
): number {
  return totalCorrect > 0
    ? (totalCertainty / totalCorrect) * PERCENTAGE_MULTIPLIER
    : 0;
}
