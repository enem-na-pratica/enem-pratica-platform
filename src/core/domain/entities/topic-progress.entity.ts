export const TOPIC_STATUS = {
  COMPREHENDED: 'COMPREHENDED',
  PRACTICE: 'PRACTICE',
  REVIEW: 'REVIEW',
} as const;
export type TopicStatus = (typeof TOPIC_STATUS)[keyof typeof TOPIC_STATUS];

type TopicProgressProps = {
  id?: string;
  userId: string;
  topicId: string;
  status: TopicStatus;
  updatedAt?: Date;
  createdAt?: Date;
};

type CreateTopicProgressProps = Prettify<
  Omit<TopicProgressProps, 'id' | 'updatedAt' | 'createdAt'>
>;

type LoadTopicProgressProps = Required<TopicProgressProps>;

export class TopicProgress {
  private _id: string | undefined;
  private _userId: string;
  private _topicId: string;
  private _status: TopicStatus;
  private _updatedAt: Date;
  private _createdAt: Date;

  private constructor(props: TopicProgressProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._topicId = props.topicId;
    this._status = props.status;
    const now = new Date();
    this._createdAt = props.createdAt || now;
    this._updatedAt = props.updatedAt || this._createdAt;
  }

  public static create(props: CreateTopicProgressProps): TopicProgress {
    return new TopicProgress(props);
  }

  public static load(props: LoadTopicProgressProps): TopicProgress {
    return new TopicProgress(props);
  }

  // Getters
  public get id() {
    return this._id;
  }
  public get userId() {
    return this._userId;
  }
  public get topicId() {
    return this._topicId;
  }
  public get status() {
    return this._status;
  }
  public get updatedAt() {
    return this._updatedAt;
  }
  public get createdAt() {
    return this._createdAt;
  }

  // Mutations
  public changeStatus(newStatus: TopicStatus): void {
    if (this._status === newStatus) {
      return;
    }

    this._status = newStatus;
    this._updatedAt = new Date();
  }
}
