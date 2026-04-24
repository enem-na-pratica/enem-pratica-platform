import type { Role } from '@/src/core/domain/auth';
import { PersonName, Username } from '@/src/core/domain/value-objects';

type UserProps = {
  id?: string; // Opcional ao criar a entidade, obrigatório ao carregar
  name: string;
  username: string;
  passwordHash: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
};

type CreateUserProps = Prettify<
  Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>
>;

type LoadUserProps = Prettify<Required<UserProps>>;

export class User {
  private _id: string | undefined;
  private _name: PersonName;
  private _username: Username;
  private _passwordHash: string;
  private _role: Role;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    this._id = props.id;
    this._name = PersonName.create(props.name);
    this._username = Username.create(props.username);
    this._passwordHash = props.passwordHash;
    this._role = props.role;

    const now = new Date();
    this._createdAt = props.createdAt || now;
    this._updatedAt = props.updatedAt || this._createdAt;
  }

  public static create(props: CreateUserProps): User {
    return new User(props);
  }

  public static load(props: LoadUserProps): User {
    return new User(props);
  }

  // --- Getters ---
  public get id(): string | undefined {
    return this._id;
  }
  public get name(): string {
    return this._name.value;
  }
  public get username(): string {
    return this._username.value;
  }
  public get passwordHash(): string {
    return this._passwordHash;
  }
  public get role(): Role {
    return this._role;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  // --- Mutations ---
  public changeName(newName: string): void {
    this._name = PersonName.create(newName);
    this.updateTimestamp();
  }

  public changeUsername(newUsername: string): void {
    this._username = Username.create(newUsername);
    this.updateTimestamp();
  }

  public changePasswordHash(newPasswordHash: string): void {
    this._passwordHash = newPasswordHash;
    this.updateTimestamp();
  }

  public assignRole(newRole: Role): void {
    this._role = newRole;
    this.updateTimestamp();
  }

  private updateTimestamp(): void {
    this._updatedAt = new Date();
  }
}
