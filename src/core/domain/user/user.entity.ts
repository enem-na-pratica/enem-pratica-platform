import { Role } from '@/src/core/domain/auth/roles';
import { validName } from '@/src/core/domain/user/rules';

interface UserProps {
  id?: string; // Opcional ao criar a entidade, obrigatório ao carregar
  name: string;
  username: string;
  passwordHash: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private _id: string | undefined;
  private _name: string;
  private _username: string;
  private _passwordHash: string;
  private _role: Role;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    this._id = props.id;
    this._name = props.name;
    this._username = props.username;
    this._passwordHash = props.passwordHash;
    this._role = props.role;

    const now = new Date();
    this._createdAt = props.createdAt || now;
    this._updatedAt = props.updatedAt || this._createdAt;
  }

  public static create(props: Omit<UserProps, "id" | "createdAt" | "updatedAt">): User {
    validName(props.name);
    validName(props.username);

    return new User({
      ...props,
    });
  }

  public static load(props: UserProps): User {
    if (!props.id) {
      throw new Error('User ID is required for loading a persisted entity.');
    }
    return new User(props);
  }

  // --- Getters ---
  public get id(): string | undefined {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get username(): string {
    return this._username;
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

  // --- Métodos de Domínio (Mutações) ---
  public changeName(newName: string): void {
    validName(newName);
    this._name = newName;
    this.updateTimestamp();
  }

  public changeUsername(newUsername: string): void {
    validName(newUsername);
    this._username = newUsername;
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