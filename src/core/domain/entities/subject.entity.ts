import { SubjectName } from '@/src/core/domain/value-objects'

type SubjectProps = {
  id?: string;
  name: string;
  // category?: string;
  createdAt?: Date;
}

type CreateSubjectProps = Prettify<Omit<SubjectProps, "id" | "createdAt">>;

type LoadSubjectProps = Prettify<Required<SubjectProps>>;

export class Subject {
  private _id: string | undefined;
  private _name: SubjectName;
  private _createdAt: Date;

  private constructor(props: SubjectProps) {
    this._id = props.id;
    this._name = SubjectName.create(props.name);
    this._createdAt = props.createdAt || new Date();
  }

  public static create(props: CreateSubjectProps): Subject {
    return new Subject(props);
  }

  public static load(props: LoadSubjectProps): Subject {
    return new Subject(props);
  }

  // --- Getters ---
  public get id(): string | undefined { return this._id }
  public get name(): string { return this._name.value }
  public get createdAt(): Date { return this._createdAt }

  // --- Mutations ---
  public changeName(newName: string): void {
    this._name = SubjectName.create(newName);
  }
}