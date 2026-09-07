import type { MockExamTotals } from '../../_utils';

type MockExamTableTotalRowProps = MockExamTotals & {
  globalPerformance: number;
  globalConfidence: number;
};

export function MockExamTableTotalRow({
  totalCorrect,
  totalWrong,
  totalCertainty,
  totalDoubtHit,
  totalDoubtError,
  totalCritical,
  totalDistraction,
  totalInterpretation,
  totalKnowledge,
  globalPerformance,
  globalConfidence,
}: MockExamTableTotalRowProps) {
  return (
    <tr className="border-t-2 border-(--foreground)/20 bg-(--foreground)/10 font-bold">
      <td className="p-3 text-left text-xs tracking-widest uppercase">TOTAL</td>
      <td className="p-3 text-base text-(--success)">{totalCorrect}</td>
      <td className="p-3 text-(--error)">{totalWrong}</td>
      <td className="p-3 text-base">{globalPerformance.toFixed(1)}%</td>
      <td className="p-3 text-(--success)">{totalCertainty}</td>
      <td className="p-3 opacity-70">{globalConfidence.toFixed(1)}%</td>
      <td className="p-3 text-(--accent)">{totalDoubtHit}</td>
      <td className="p-3 text-(--accent)">{totalDoubtError}</td>
      <td className="p-3 text-(--error)">{totalCritical}</td>
      <td className="p-3 text-orange-500">{totalDistraction}</td>
      <td className="p-3 text-orange-500">{totalInterpretation}</td>
      <td className="p-3 text-orange-500">{totalKnowledge}</td>
    </tr>
  );
}
