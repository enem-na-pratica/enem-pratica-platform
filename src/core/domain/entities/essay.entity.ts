import { EssayGrades, EssayTheme } from '@/src/core/domain/value-objects';
import type { CompetencyIndex, Grades } from '@/src/core/domain/value-objects';

const Competency = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  FOURTH: 4,
  FIFTH: 5,
} as const;

type EssayProps = {
  id?: string;
  authorId: string;
  theme: string;
  competency1: number;
  competency2: number;
  competency3: number;
  competency4: number;
  competency5: number;
  createdAt?: Date;
};

type CreateEssayProps = Prettify<Omit<EssayProps, 'id' | 'createdAt'>>;

type LoadEssayProps = Prettify<Required<EssayProps>>;

export class Essay {
  private _id: string | undefined;
  private _authorId: string;
  private _theme: EssayTheme;
  private _grades: EssayGrades;
  private _createdAt: Date;

  private constructor(props: EssayProps) {
    this._id = props.id;
    this._authorId = props.authorId;
    this._theme = EssayTheme.create(props.theme);
    this._grades = EssayGrades.createFromPrimitives({
      c1: props.competency1,
      c2: props.competency2,
      c3: props.competency3,
      c4: props.competency4,
      c5: props.competency5,
    });
    this._createdAt = props.createdAt || new Date();
  }

  public static create(props: CreateEssayProps): Essay {
    return new Essay(props);
  }

  public static load(props: LoadEssayProps): Essay {
    return new Essay(props);
  }

  // --- Getters ---
  public get id(): string | undefined {
    return this._id;
  }
  public get authorId(): string {
    return this._authorId;
  }
  public get theme(): string {
    return this._theme.value;
  }
  public get competency1(): number {
    return this._grades.getScore(Competency.FIRST);
  }
  public get competency2(): number {
    return this._grades.getScore(Competency.SECOND);
  }
  public get competency3(): number {
    return this._grades.getScore(Competency.THIRD);
  }
  public get competency4(): number {
    return this._grades.getScore(Competency.FOURTH);
  }
  public get competency5(): number {
    return this._grades.getScore(Competency.FIFTH);
  }
  public get createdAt(): Date {
    return this._createdAt;
  }

  public getCompetency(index: CompetencyIndex): number {
    return this._grades.getScore(index);
  }

  public get totalScore(): number {
    return this._grades.totalScore;
  }

  // --- Mutations ---
  public changeTheme(newTheme: string): void {
    this._theme = EssayTheme.create(newTheme);
  }

  public changeGrades(grades: Partial<Grades>): void {
    this._grades = this._grades.updateGrades(grades);
  }
}
