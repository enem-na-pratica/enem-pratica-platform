import {
  AreaPerformance,
  type KnowledgeArea,
  KNOWLEDGE_AREA,
  type CreateAreaPerformanceProps,
  type LoadAreaPerformanceProps,
  type AreaPerformanceProps,
  type UpdateAreaPerformanceProps,
} from './area-performance.entity';

export const KNOWLEDGE_AREA_MAP = {
  "languages": KNOWLEDGE_AREA.LANGUAGES,
  "humanities": KNOWLEDGE_AREA.HUMANITIES,
  "naturalSciences": KNOWLEDGE_AREA.NATURAL_SCIENCES,
  "mathematics": KNOWLEDGE_AREA.MATHEMATICS,
} as const satisfies Record<string, KnowledgeArea>;

type KnowledgeAreaLabelKey = keyof typeof KNOWLEDGE_AREA_MAP;

type MockExamProps = {
  id?: string,
  authorId: string,
  title: string,
  performances: Record<
    KnowledgeAreaLabelKey,
    Prettify<AreaPerformanceProps>
  >,
  createdAt?: Date
}

type CreateMockExamProps = Prettify<Omit<
  MockExamProps,
  "id" | "createdAt" | "performances"
> & {
  performances: Record<
    KnowledgeAreaLabelKey,
    Prettify<Omit<CreateAreaPerformanceProps, "area">>
  >,
}>;

type LoadMockExamProps = Prettify<Required<Omit<MockExamProps, "performances">> & {
  performances: Record<
    KnowledgeAreaLabelKey,
    Prettify<LoadAreaPerformanceProps>
  >,
}>;

type UpdateMockExamProps = {
  title?: string;
  performances?: Partial<Record<
    KnowledgeAreaLabelKey,
    UpdateAreaPerformanceProps
  >>;
};


export class MockExam {
  private _id: string | undefined;
  private _authorId: string;
  private _title: string;
  private _performances: Record<KnowledgeArea, AreaPerformance>;
  private _createdAt: Date;

  private constructor(props: MockExamProps) {
    this.validatePerformances(props.performances);

    this._id = props.id;
    this._authorId = props.authorId;
    this._title = props.title;
    this._createdAt = props.createdAt || new Date();

    this._performances = {} as Record<KnowledgeArea, AreaPerformance>;

    (Object.keys(props.performances) as KnowledgeAreaLabelKey[]).forEach((key) => {
      const areaEnum = KNOWLEDGE_AREA_MAP[key];
      const performanceProps = props.performances[key];

      if (this._id) {
        // Context: LOAD
        this._performances[areaEnum] = AreaPerformance.load({
          ...performanceProps,
          area: areaEnum,
        } as LoadAreaPerformanceProps);
      } else {
        // Context: CREATE
        this._performances[areaEnum] = AreaPerformance.create({
          ...performanceProps,
          area: areaEnum,
        } as CreateAreaPerformanceProps);
      }
    });
  }

  public static create(props: CreateMockExamProps): MockExam {
    return new MockExam(props as unknown as MockExamProps);
  }

  public static load(props: LoadMockExamProps): MockExam {
    return new MockExam(props);
  }

  private validatePerformances(performances: MockExamProps['performances']): void {
    if (!performances) {
      throw new Error("Performance data is required.");
    }

    const requiredAreas = Object.keys(KNOWLEDGE_AREA_MAP) as KnowledgeAreaLabelKey[];

    for (const areaKey of requiredAreas) {
      if (!performances[areaKey]) {
        throw new Error(`Missing performance data for required area: ${areaKey}`);
      }
    }
  }

  public get id(): string | undefined {
    return this._id;
  }

  public get authorId(): string {
    return this._authorId;
  }

  public get title(): string {
    return this._title;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get performances(): Record<KnowledgeArea, AreaPerformance> {
    return { ...this._performances };
  }

  public getPerformanceByArea(area: KnowledgeArea): AreaPerformance {
    return this._performances[area];
  }

  public update(props: UpdateMockExamProps): void {
    if (props.title !== undefined) {
      this._title = props.title;
    }

    if (props.performances) {
      (Object.keys(props.performances) as KnowledgeAreaLabelKey[]).forEach((key) => {
        const areaEnum = KNOWLEDGE_AREA_MAP[key];
        const updateData = props.performances![key];

        if (updateData && this._performances[areaEnum]) {
          this._performances[areaEnum].update(updateData);
        }
      });
    }
  }
}