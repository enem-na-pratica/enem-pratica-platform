import { CompetencyScore, Theme } from "@/src/core/domain/value-objects";

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

type CompetenciesTuple = [
  CompetencyScore,
  CompetencyScore,
  CompetencyScore,
  CompetencyScore,
  CompetencyScore
];

type CompetencyIndex = 1 | 2 | 3 | 4 | 5;

export class Essay {
  private _id: string | undefined;
  private _authorId: string;
  private _theme: Theme;
  private _competencies: CompetenciesTuple;
  private _createdAt: Date;

  private constructor(props: EssayProps) {
    this._id = props.id;
    this._authorId = props.authorId;
    this._theme = Theme.create(props.theme);
    this._competencies = [
      CompetencyScore.create(props.competency1),
      CompetencyScore.create(props.competency2),
      CompetencyScore.create(props.competency3),
      CompetencyScore.create(props.competency4),
      CompetencyScore.create(props.competency5),
    ];
    this._createdAt = props.createdAt || new Date();
  }

  public static create(props: Omit<EssayProps, "id" | "createdAt">): Essay {
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
  public get theme(): string { return this._theme.value; }
  public get competency1(): number { return this._competencies[0].value; }
  public get competency2(): number { return this._competencies[1].value; }
  public get competency3(): number { return this._competencies[2].value; }
  public get competency4(): number { return this._competencies[3].value; }
  public get competency5(): number { return this._competencies[4].value; }
  public get createdAt(): Date { return this._createdAt; }

  public getCompetency(index: CompetencyIndex): number {
    return this._competencies[index - 1].value;
  }

  public get totalScore(): number {
    return this._competencies.reduce((acc, curr) => acc + curr.value, 0);
  }

  // --- Mutações ---
  public changeTheme(newTheme: string): void {
    this._theme = Theme.create(newTheme);
  }

  public changeGrades(
    grades: Partial<Record<'c1' | 'c2' | 'c3' | 'c4' | 'c5', number>>
  ): void {
    const mapping = { c1: 0, c2: 1, c3: 2, c4: 3, c5: 4 } as const;

    for (const [key, value] of Object.entries(grades)) {
      if (value !== undefined) {
        const index = mapping[key as keyof typeof mapping];
        this._competencies[index] = CompetencyScore.create(value);
      }
    }
  }
}