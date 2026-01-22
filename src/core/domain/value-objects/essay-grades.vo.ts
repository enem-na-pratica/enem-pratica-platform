import { ValueObject } from "@/src/core/domain/shared";
import { CompetencyScore } from "./competency-score.vo";

type GradesTuple = [
  CompetencyScore,
  CompetencyScore,
  CompetencyScore,
  CompetencyScore,
  CompetencyScore
];

type CompetencyIndex = 1 | 2 | 3 | 4 | 5;

type RawGradesProps = {
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
};

export class EssayGrades extends ValueObject<GradesTuple> {
  private constructor(grades: GradesTuple) {
    super(grades);
  }

  protected validate(grades: GradesTuple): void {
    if (!Array.isArray(grades) || grades.length !== 5) {
      throw new Error("EssayGrades must contain exactly 5 competency scores.");
    }
  }

  public static create(grades: GradesTuple): EssayGrades {
    return new EssayGrades(grades);
  }

  public static createFromPrimitives(props: RawGradesProps): EssayGrades {
    const grades: GradesTuple = [
      CompetencyScore.create(props.c1),
      CompetencyScore.create(props.c2),
      CompetencyScore.create(props.c3),
      CompetencyScore.create(props.c4),
      CompetencyScore.create(props.c5),
    ];
    return new EssayGrades(grades);
  }

  public get totalScore(): number {
    return this._value.reduce((acc, curr) => acc + curr.value, 0);
  }

  public getScore(index: CompetencyIndex): number {
    return this._value[index - 1].value;
  }

  public updateGrades(
    updates: Partial<Record<'c1' | 'c2' | 'c3' | 'c4' | 'c5', number>>
  ): EssayGrades {
    const mapping = { c1: 0, c2: 1, c3: 2, c4: 3, c5: 4 } as const;

    const newScores = [...this._value] as GradesTuple;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        const index = mapping[key as keyof typeof mapping];
        newScores[index] = CompetencyScore.create(value);
      }
    }

    return new EssayGrades(newScores);
  }

  public equals(vo?: ValueObject<GradesTuple>): boolean {
    if (!vo || !vo.value) return false;

    return this._value.every((score, index) => score.equals(vo.value[index]));
  }
}
