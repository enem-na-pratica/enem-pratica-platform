type QuestionSessionProps = {
  id?: string;
  authorId: string;
  topicId: string;
  date?: string;
  total: number;
  correct: number;
  isReviewed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type CreateQuestionSessionProps = Prettify<
  Omit<QuestionSessionProps, 'id' | 'createdAt' | 'updatedAt'>
>;

type LoadQuestionSessionProps = Prettify<Required<QuestionSessionProps>>;

export const REVIEW_THRESHOLDS = {
  EXCELLENT: 0.9, // 90%
  GOOD: 0.75, // 75%
} as const;

export const REVIEW_DAYS = {
  EXCELLENT: 21,
  GOOD: 14,
  DEFAULT: 7,
} as const;

export class QuestionSession {
  private _id: string | undefined;
  private _authorId: string;
  private _topicId: string;
  private _date: string;
  private _total: number;
  private _correct: number;
  private _isReviewed: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: QuestionSessionProps) {
    this.validateScores(props.total, props.correct);

    if (props.date) {
      this.validateDateFormat(props.date);
      this._date = props.date;
    } else {
      const todayString = QuestionSession.getTodayInTimeZone();
      this._date = todayString;
    }

    this._id = props.id;
    this._authorId = props.authorId;
    this._topicId = props.topicId;
    this._total = props.total;
    this._correct = props.correct;
    this._isReviewed = props.isReviewed ?? false;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || this._createdAt;
  }

  public static create(props: CreateQuestionSessionProps): QuestionSession {
    return new QuestionSession(props);
  }

  public static load(props: LoadQuestionSessionProps): QuestionSession {
    return new QuestionSession(props);
  }

  private validateDateFormat(dateString: string): void {
    const isoFormatRegex = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;

    if (!isoFormatRegex.test(dateString)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD.');
    }

    const [year, month, day] = dateString.split('-').map(Number);
    const parsedDate = new Date(year, month - 1, day);

    if (
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() !== month - 1 ||
      parsedDate.getDate() !== day
    ) {
      throw new Error('The provided date does not exist in the calendar.');
    }
  }

  private static getTodayInTimeZone(
    timeZone: string = 'America/Sao_Paulo',
  ): string {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return formatter.format(new Date());
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
  public get date(): string {
    return this._date;
  }
  public get total(): number {
    return this._total;
  }
  public get correct(): number {
    return this._correct;
  }
  public get isReviewed(): boolean {
    return this._isReviewed;
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

  public get nextReviewDate(): string | null {
    if (this._total === 0 || this._isReviewed) {
      return null;
    }

    const daysToAdd = this.calculateDaysToAdd(this.performance);

    const nextDate = new Date(this._date);
    nextDate.setDate(nextDate.getDate() + daysToAdd);

    return nextDate.toISOString().split('T')[0];
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
