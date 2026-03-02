import { Slug, SubjectName } from '@/src/core/domain/value-objects';

type SubjectProps = {
  id?: string;
  name: string;
  slug: string;
  // category?: string;
  createdAt?: Date;
};

type CreateSubjectProps = Prettify<
  Omit<SubjectProps, 'id' | 'slug' | 'createdAt'>
>;

type LoadSubjectProps = Prettify<Required<SubjectProps>>;

export class Subject {
  private _id: string | undefined;
  private _name: SubjectName;
  private _slug: Slug;
  private _createdAt: Date;

  private constructor(props: SubjectProps) {
    this._id = props.id;
    this._name = SubjectName.create(props.name);
    this._slug = Slug.create(props.slug);
    this._createdAt = props.createdAt || new Date();
  }

  public static create({ name }: CreateSubjectProps): Subject {
    return new Subject({ name, slug: name });
  }

  public static load(props: LoadSubjectProps): Subject {
    return new Subject(props);
  }

  // --- Getters ---
  public get id(): string | undefined {
    return this._id;
  }
  public get name(): string {
    return this._name.value;
  }
  public get slug(): string {
    return this._slug.value;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }

  // --- Mutations ---
  private changeSlug(newSlug: string): void {
    this._slug = Slug.create(newSlug);
  }

  public changeName(newName: string): void {
    this._name = SubjectName.create(newName);
    this.changeSlug(newName);
  }
}
