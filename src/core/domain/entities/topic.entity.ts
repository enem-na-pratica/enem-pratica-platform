import { TopicTitle, TopicPosition } from '@/src/core/domain/value-objects';

type TopicProps = {
  id?: string;
  subjectId: string;
  title: string;
  position: number;
  createdAt?: Date;
}

type CreateTopicProps = Prettify<Omit<TopicProps, "id" | "createdAt">>;

type LoadTopicProps = Prettify<Required<TopicProps>>;

export class Topic {
  private _id: string | undefined;
  private _subjectId: string;
  private _title: TopicTitle;
  private _position: TopicPosition;
  private _createdAt: Date;

  constructor(props: TopicProps) {
    this._id = props.id;
    this._subjectId = props.subjectId;
    this._title = TopicTitle.create(props.title);
    this._position = TopicPosition.create(props.position);
    this._createdAt = props.createdAt || new Date();
  }

  public static create(props: CreateTopicProps): Topic {
    return new Topic(props);
  }

  public static load(props: LoadTopicProps): Topic {
    return new Topic(props);
  }

  // --- Getters ---
  public get id(): string | undefined { return this._id; }
  public get subjectId(): string { return this._subjectId; }
  public get title(): string { return this._title.value; }
  public get position(): number { return this._position.value; }
  public get createdAt(): Date { return this._createdAt; }

  // --- Mutations ---
  public changeTitle(newTitle: string): void {
    this._title = TopicTitle.create(newTitle);
  }

  public changePosition(newPosition: number): void {
    this._position = TopicPosition.create(newPosition);
  }
}