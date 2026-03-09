type QuestionSessionProps = {
  id?: string;
  authorId: string;
  topicId: string;
  date?: Date;
  total: number;
  correct: number;
  isReviewing?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type CreateQuestionSessionProps = Prettify<
  Omit<QuestionSessionProps, 'id' | 'createdAt' | 'updatedAt'>
>;

type LoadQuestionSessionProps = Prettify<Required<QuestionSessionProps>>;

const REVIEW_THRESHOLDS = {
  EXCELLENT: 0.9, // 90%
  GOOD: 0.75, // 75%
} as const;

const REVIEW_DAYS = {
  EXCELLENT: 21,
  GOOD: 14,
  DEFAULT: 7,
} as const;

export class QuestionSession {
  private _id: string | undefined;
  private _authorId: string;
  private _topicId: string;
  private _date: Date;
  private _total: number;
  private _correct: number;
  private _isReviewing: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: QuestionSessionProps) {
    this.validateScores(props.total, props.correct);

    this._id = props.id;
    this._authorId = props.authorId;
    this._topicId = props.topicId;
    const now = new Date();
    this._date = props.date || now;
    this._total = props.total;
    this._correct = props.correct;
    this._isReviewing = props.isReviewing ?? false;
    this._createdAt = props.createdAt || now;
    this._updatedAt = props.updatedAt || this._createdAt;
  }

  public static create(props: CreateQuestionSessionProps): QuestionSession {
    return new QuestionSession(props);
  }

  public static load(props: LoadQuestionSessionProps): QuestionSession {
    return new QuestionSession(props);
  }

  // --- Getters ---
  public get id(): string | undefined {
    return this._id;
  }
  public get authorId(): string {
    return this._authorId;
  }
  public get topicId(): string {
    return this._topicId;
  }
  public get date(): Date {
    return this._date;
  }
  public get total(): number {
    return this._total;
  }
  public get correct(): number {
    return this._correct;
  }
  public get isReviewing(): boolean {
    return this._isReviewing;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  // Getters Calculados
  public get incorrect(): number {
    return this._total - this._correct;
  }

  public get performance(): number {
    if (this._total === 0) return 0;
    return this._correct / this._total;
  }

  public get nextReviewDate(): Date | null {
    if (this._total === 0 || this._isReviewing) {
      return null;
    }

    const daysToAdd = this.calculateDaysToAdd(this.performance);

    const nextDate = new Date(this._date);
    nextDate.setDate(nextDate.getDate() + daysToAdd);

    return nextDate;
  }

  private calculateDaysToAdd(performance: number): number {
    if (performance >= REVIEW_THRESHOLDS.EXCELLENT) {
      return REVIEW_DAYS.EXCELLENT;
    }

    if (performance >= REVIEW_THRESHOLDS.GOOD) {
      return REVIEW_DAYS.GOOD;
    }

    return REVIEW_DAYS.DEFAULT;
  }

  private validateScores(total: number, correct: number): void {
    this.validateIsInteger(total, 'total');
    this.validateIsInteger(correct, 'correct');

    if (total <= 0) {
      throw new Error('Total questions must be greater than zero.');
    }

    if (correct < 0 || correct > total) {
      throw new Error(
        'Correct answers must be between 0 and the total number of questions.',
      );
    }
  }

  private validateIsInteger(value: number, fieldName: string): void {
    if (!Number.isInteger(value)) {
      throw new Error(`The field "${fieldName}" must be an integer.`);
    }
  }
}
