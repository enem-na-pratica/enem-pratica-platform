import { validCompetency, validTheme } from "@/src/core/domain/essay/rules"

interface EssayProps {
  id?: string;
  authorId: string;
  theme: string;
  competency1: number;
  competency2: number;
  competency3: number;
  competency4: number;
  competency5: number;
  createdAt?: Date;
}

export class Essay {
  private _id: string | undefined;
  private _authorId: string;
  private _theme: string;
  private _competency1: number;
  private _competency2: number;
  private _competency3: number;
  private _competency4: number;
  private _competency5: number;
  private _createdAt: Date;

  private constructor(props: EssayProps) {
    this._id = props.id;
    this._theme = props.theme;
    this._authorId = props.authorId;
    this._competency1 = props.competency1;
    this._competency2 = props.competency2;
    this._competency3 = props.competency3;
    this._competency4 = props.competency4;
    this._competency5 = props.competency5;
    this._createdAt = props.createdAt || new Date();
  }

  public static create(props: Omit<EssayProps, "id" | "createdAt">): Essay {
    validTheme(props.theme);
    validCompetency(props.competency1);
    validCompetency(props.competency2);
    validCompetency(props.competency3);
    validCompetency(props.competency4);
    validCompetency(props.competency5);

    return new Essay(props);
  }

  public static load(props: EssayProps): Essay {
    if (!props.id) {
      // TODO: Implement custom errors
      throw new Error('User ID is required for loading a persisted entity.');
    }
    return new Essay(props);
  }

  // --- Getters ---
  public get id(): string | undefined { return this._id; }
  public get authorId(): string { return this._authorId; }
  public get theme(): string { return this._theme; }
  public get competency1(): number { return this._competency1; }
  public get competency2(): number { return this._competency2; }
  public get competency3(): number { return this._competency3; }
  public get competency4(): number { return this._competency4; }
  public get competency5(): number { return this._competency5; }
  public get createdAt(): Date { return this._createdAt; }

  public get totalScore(): number {
    return (
      this._competency1 +
      this._competency2 +
      this._competency3 +
      this._competency4 +
      this._competency5
    );
  }

  // --- Mutações ---
  public changeTheme(theme: string): void {
    validTheme(theme);
    this._theme = theme;
  }

  public changeGrades(
    grades: Partial<Record<'c1' | 'c2' | 'c3' | 'c4' | 'c5', number>>
  ): void {
    if (grades.c1 !== undefined) {
      validCompetency(grades.c1);
      this._competency1 = grades.c1;
    }
    if (grades.c2 !== undefined) {
      validCompetency(grades.c2);
      this._competency2 = grades.c2;
    }
    if (grades.c3 !== undefined) {
      validCompetency(grades.c3);
      this._competency3 = grades.c3;
    }
    if (grades.c4 !== undefined) {
      validCompetency(grades.c4);
      this._competency4 = grades.c4;
    }
    if (grades.c5 !== undefined) {
      validCompetency(grades.c5);
      this._competency5 = grades.c5;
    }
  }
}