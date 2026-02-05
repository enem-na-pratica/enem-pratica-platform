import { ScoreCount } from "@/src/core/domain/value-objects";
// | Português        | Inglês                 |
// | ---------------- | ---------------------- |
// | Acertos*         | `correctAnswers`       |
// | Erros            | `wrongAnswers`         |
// | Rendimento       | `performanceRate`      |
// | Certeza*         | `certaintyHits`        |
// | Confiança        | `confidenceRate`       |
// | Dúvida - Acerto* | `doubtHits`            |
// | Dúvida - Erro*   | `doubtErrors`          |
// | Falha            | `criticalErrors`       |
// | Distração*       | `distractionErrors`    |
// | Interpretação*   | `interpretationErrors` |
// | Conteúdo         | `knowledgeGaps`        |
// (*) Input fields (not system-calculated)

export const KNOWLEDGE_AREA = {
  LANGUAGES: 'LANGUAGES',
  HUMANITIES: 'HUMANITIES',
  NATURAL_SCIENCES: 'NATURAL_SCIENCES',
  MATHEMATICS: 'MATHEMATICS',
} as const;

export type KnowledgeArea = typeof KNOWLEDGE_AREA[keyof typeof KNOWLEDGE_AREA];

/**
 * Macro quantitative performance metrics.
 */
export interface OverallResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  /** Success rate ranging from 0.0 to 1.0 */
  performanceRate: number;
}

/**
 * Qualitative assessment of correct answers (Certainty vs. Luck).
 */
export interface QualityAssessment {
  /** Answers marked with 100% certainty */
  certaintyHits: number;
  /** Proportion of certain hits over total correct answers, from 0.0 to 1.0 */
  confidenceRate: number;
  /** Hits achieved despite doubt (educated guesses that resulted in a correct answer) */
  doubtHits: number;
  /** Errors caused by doubt (educated guesses that resulted in a wrong answer) */
  doubtErrors: number;
  /** Errors that weren't due to simple doubt, but technical/theoretical failure */
  criticalErrors: number;
}

/**
 * Root cause breakdown of committed errors.
 */
export interface ErrorAnalysis {
  /** Errors caused by lack of attention or "careless" mistakes */
  distractionErrors: number;
  /** Errors stemming from misinterpreting the question, text, or charts */
  interpretationErrors: number;
  /** Pure lack of content mastery (genuine learning gaps) */
  knowledgeGaps: number;
}

export type AreaPerformanceProps = {
  id?: string;
  area: KnowledgeArea;

  correctCount: number;
  certaintyCount: number;
  doubtHits: number;
  doubtErrors: number;
  distractionErrors: number;
  interpretationErrors: number;
}

export type CreateAreaPerformanceProps = Omit<
  AreaPerformanceProps,
  "id"
>;

export type LoadAreaPerformanceProps = Required<AreaPerformanceProps>;

export type UpdateAreaPerformanceProps = Partial<Omit<
  AreaPerformanceProps,
  "id" | "area"
>>;

const QUESTIONS_PER_AREA = 45;

export class AreaPerformance {
  private _id?: string;
  private _mockExamId?: string;
  private _area: KnowledgeArea;

  private _correctCount: ScoreCount;
  private _certaintyCount: ScoreCount;
  private _doubtHits: ScoreCount;
  private _doubtErrors: ScoreCount;
  private _distractionErrors: ScoreCount;
  private _interpretationErrors: ScoreCount;

  private constructor(props: AreaPerformanceProps) {
    this._id = props.id;
    this._area = props.area;
    this._correctCount = ScoreCount.create(props.correctCount);
    this._certaintyCount = ScoreCount.create(props.certaintyCount);
    this._doubtHits = ScoreCount.create(props.doubtHits);
    this._doubtErrors = ScoreCount.create(props.doubtErrors);
    this._distractionErrors = ScoreCount.create(props.distractionErrors);
    this._interpretationErrors = ScoreCount.create(props.interpretationErrors);
  }

  static create(props: CreateAreaPerformanceProps): AreaPerformance {
    return new AreaPerformance(props);
  }

  static load(props: LoadAreaPerformanceProps): AreaPerformance {
    return new AreaPerformance(props);
  }

  // --- Getters ---
  public get id(): string | undefined { return this._id }
  public get mockExamId(): string | undefined { return this._mockExamId }
  public get area(): KnowledgeArea { return this._area }

  public get overallResult(): OverallResult {
    const correct = this._correctCount.value;

    return {
      totalQuestions: QUESTIONS_PER_AREA,
      correctAnswers: correct,
      wrongAnswers: QUESTIONS_PER_AREA - correct,
      performanceRate: correct / QUESTIONS_PER_AREA,
    };
  }

  public get qualityAssessment(): QualityAssessment {
    const correct = this._correctCount.value;
    const certainty = this._certaintyCount.value;
    const doubtHits = this._doubtHits.value;
    const doubtErrors = this._doubtErrors.value;
    const doubt = doubtHits + doubtErrors;

    const wrong = QUESTIONS_PER_AREA - correct;

    return {
      certaintyHits: certainty,
      confidenceRate: correct > 0 ? certainty / correct : 0,
      doubtHits: doubtHits,
      doubtErrors: doubtErrors,
      criticalErrors: wrong - doubt,
    };
  }

  public get errorAnalysis(): ErrorAnalysis {
    const distraction = this._distractionErrors.value;
    const interpretation = this._interpretationErrors.value;
    const doubtHits = this._doubtHits.value;
    const doubtErrors = this._doubtErrors.value;

    const wrong = QUESTIONS_PER_AREA - this._correctCount.value;
    const doubt = doubtHits + doubtErrors;
    const criticalErrors = wrong - doubt;
    const knowledgeGaps = criticalErrors - distraction - interpretation;

    return {
      distractionErrors: distraction,
      interpretationErrors: interpretation,
      knowledgeGaps: Math.max(0, knowledgeGaps)
    };
  }

  public update(props: UpdateAreaPerformanceProps): void {
    if (props.correctCount !== undefined) {
      this._correctCount = ScoreCount.create(props.correctCount);
    }
    if (props.certaintyCount !== undefined) {
      this._certaintyCount = ScoreCount.create(props.certaintyCount);
    }
    if (props.doubtHits !== undefined) {
      this._doubtHits = ScoreCount.create(props.doubtHits);
    }
    if (props.doubtErrors !== undefined) {
      this._doubtErrors = ScoreCount.create(props.doubtErrors);
    }
    if (props.distractionErrors !== undefined) {
      this._distractionErrors = ScoreCount.create(props.distractionErrors);
    }
    if (props.interpretationErrors !== undefined) {
      this._interpretationErrors = ScoreCount.create(props.interpretationErrors);
    }
  }
}