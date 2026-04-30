import type { KnowledgeAreaLabelKey, MockExam } from '@/src/web/api';
import { KNOWLEDGE_AREA_LABELS } from '@/src/web/config';

const AREA_KEYS: KnowledgeAreaLabelKey[] = [
  'languages',
  'humanities',
  'naturalSciences',
  'mathematics',
];

const TOTAL_QUESTIONS_GLOBAL = 180;
const PERCENTAGE_MULTIPLIER = 100;

export function MockExamItem({ mock }: { mock: MockExam }) {
  const initialTotals = {
    totalCorrect: 0,
    totalWrong: 0,
    totalCertainty: 0,
    totalDoubtHit: 0,
    totalDoubtError: 0,
    totalCritical: 0,
    totalDistraction: 0,
    totalInterpretation: 0,
    totalKnowledge: 0,
  };

  const totals = AREA_KEYS.reduce(
    (acc, key) => {
      const stats = mock.performances[key].statistics;

      acc.totalCorrect += stats.overallResult.correctAnswers;
      acc.totalWrong += stats.overallResult.wrongAnswers;
      acc.totalCertainty += stats.qualityAssessment.certaintyHits;
      acc.totalDoubtHit += stats.qualityAssessment.doubtHits;
      acc.totalDoubtError += stats.qualityAssessment.doubtErrors;
      acc.totalCritical += stats.qualityAssessment.criticalErrors;
      acc.totalDistraction += stats.errorAnalysis.distractionErrors;
      acc.totalInterpretation += stats.errorAnalysis.interpretationErrors;
      acc.totalKnowledge += stats.errorAnalysis.knowledgeGapsErrors;

      return acc;
    },
    { ...initialTotals },
  );
  // type Totals = typeof initialTotals;

  const {
    totalCertainty,
    totalCorrect,
    totalCritical,
    totalDistraction,
    totalDoubtError,
    totalDoubtHit,
    totalInterpretation,
    totalKnowledge,
    totalWrong,
  } = totals;

  const globalPerformance =
    (totalCorrect / TOTAL_QUESTIONS_GLOBAL) * PERCENTAGE_MULTIPLIER;
  const globalConfidence =
    totalCorrect > 0
      ? (totalCertainty / totalCorrect) * PERCENTAGE_MULTIPLIER
      : 0;

  return (
    <div className="card card-interactive overflow-hidden border-t-4 border-(--accent) p-0">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-(--foreground)/5 bg-(--card-background) p-4">
        <div>
          <h3 className="text-lg font-bold">{mock.title}</h3>
          <span className="font-mono text-xs opacity-50">
            {mock.createdAt.toLocaleDateString('pt-BR')}
          </span>
        </div>
        <div className="text-right">
          <span className="block text-xs font-bold uppercase opacity-50">
            Média Geral
          </span>
          <span className="text-2xl font-black text-(--accent)">
            {globalPerformance.toFixed(1)}%
          </span>
        </div>
      </div>
      {/* Improvement suggestion: it might be worth considering a dropdown in the
      future. This way, only the basic information is shown initially, and
      additional details are revealed on user interaction, keeping the UI clean
      and uncluttered. */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center text-sm">
          <thead>
            <tr className="bg-(--foreground)/5 text-xs font-bold tracking-wider uppercase opacity-70">
              <th className="min-w-25 p-2 text-left">Área</th>
              <th className="min-w-15 p-2 text-(--success)">Acertos</th>
              <th className="min-w-15 p-2 text-(--error)">Erros</th>
              <th className="min-w-20 p-2">Rend.</th>
              <th className="min-w-15 p-2 text-(--success)">Certeza</th>
              <th className="min-w-20 p-2">Confiança</th>
              <th className="min-w-15 p-2 text-(--accent)">Dúvida (A)</th>
              <th className="min-w-15 p-2 text-(--accent)">Dúvida (E)</th>
              <th className="min-w-15 p-2 text-(--error)">Falha</th>
              <th className="min-w-15 p-2 text-orange-500">Distr.</th>
              <th className="min-w-15 p-2 text-orange-500">Interp.</th>
              <th className="min-w-15 p-2 text-orange-500">Cont.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--foreground)/5 font-mono">
            {AREA_KEYS.map((key) => {
              const perf = mock.performances[key];
              const stats = perf.statistics;
              return (
                <tr
                  key={key}
                  className="transition-colors hover:bg-(--foreground)/5"
                >
                  <td className="p-2 text-left font-sans font-bold opacity-80">
                    {KNOWLEDGE_AREA_LABELS[perf.area]}
                  </td>
                  {/* Acertos */}
                  <td className="p-2 font-bold text-(--success)">
                    {stats.overallResult.correctAnswers}
                  </td>
                  {/* Erros */}
                  <td className="p-2 text-(--error)">
                    {stats.overallResult.wrongAnswers}
                  </td>
                  {/* Rendimento */}
                  <td className="p-2 font-bold">
                    {(
                      stats.overallResult.performanceRate *
                      PERCENTAGE_MULTIPLIER
                    ).toFixed(1)}
                    %
                  </td>
                  {/* Certeza */}
                  <td className="p-2 text-(--success) opacity-80">
                    {stats.qualityAssessment.certaintyHits}
                  </td>
                  {/* Confiança */}
                  <td className="p-2 opacity-70">
                    {(
                      stats.qualityAssessment.confidenceRate *
                      PERCENTAGE_MULTIPLIER
                    ).toFixed(1)}
                    %
                  </td>
                  {/* Dúvida Acerto */}
                  <td className="p-2 text-(--accent)">
                    {stats.qualityAssessment.doubtHits}
                  </td>
                  {/* Dúvida Erro */}
                  <td className="p-2 text-(--accent) opacity-80">
                    {stats.qualityAssessment.doubtErrors}
                  </td>
                  {/* Falha */}
                  <td className="p-2 font-bold text-(--error)">
                    {stats.qualityAssessment.criticalErrors}
                  </td>
                  {/* Distração */}
                  <td className="p-2 text-orange-500">
                    {stats.errorAnalysis.distractionErrors}
                  </td>
                  {/* Interpretação */}
                  <td className="p-2 text-orange-500">
                    {stats.errorAnalysis.interpretationErrors}
                  </td>
                  {/* Conteúdo */}
                  <td className="p-2 font-bold text-orange-500">
                    {stats.errorAnalysis.knowledgeGapsErrors}
                  </td>
                </tr>
              );
            })}
            {/* Total Line */}
            <tr className="border-t-2 border-(--foreground)/20 bg-(--foreground)/10 font-bold">
              <td className="p-3 text-left text-xs tracking-widest uppercase">
                TOTAL
              </td>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
