import { ScoreCount } from "@/src/core/domain/value-objects";
// | Português     | Inglês                 |
// | ------------- | ---------------------- |
// | Acertos       | `correctAnswers`       |
// | Erros         | `wrongAnswers`         |
// | Rendimento    | `performanceRate`      |
// | Certeza       | `certaintyHits`        |
// | Confiança     | `confidenceRate`       |
// | Dúvida        | `correctGuesses`       |
// | Falha         | `criticalErrors`       |
// | Distração     | `distractionErrors`    |
// | Interpretação | `interpretationErrors` |
// | Conteúdo      | `knowledgeGaps`        |

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
  /** Hits achieved through elimination or educated guesses */
  correctGuesses: number;
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
  doubtCount: number;
  distractionCount: number;
  interpretationCount: number;
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
  private _doubtCount: ScoreCount;
  private _distractionCount: ScoreCount;
  private _interpretationCount: ScoreCount;

  private constructor(props: AreaPerformanceProps) {
    this._id = props.id;
    this._area = props.area;
    this._correctCount = ScoreCount.create(props.correctCount);
    this._certaintyCount = ScoreCount.create(props.certaintyCount);
    this._doubtCount = ScoreCount.create(props.doubtCount);
    this._distractionCount = ScoreCount.create(props.distractionCount);
    this._interpretationCount = ScoreCount.create(props.interpretationCount);
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
    const doubt = this._doubtCount.value;

    const wrong = QUESTIONS_PER_AREA - correct;

    return {
      certaintyHits: certainty,
      confidenceRate: correct > 0 ? certainty / correct : 0,
      correctGuesses: doubt,
      criticalErrors: wrong - doubt
    };
  }

  public get errorAnalysis(): ErrorAnalysis {
    const distraction = this._distractionCount.value;
    const interpretation = this._interpretationCount.value;

    const wrong = QUESTIONS_PER_AREA - this._correctCount.value;
    const criticalErrors = wrong - this._doubtCount.value;
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
    if (props.doubtCount !== undefined) {
      this._doubtCount = ScoreCount.create(props.doubtCount);
    }
    if (props.distractionCount !== undefined) {
      this._distractionCount = ScoreCount.create(props.distractionCount);
    }
    if (props.interpretationCount !== undefined) {
      this._interpretationCount = ScoreCount.create(props.interpretationCount);
    }
  }
}