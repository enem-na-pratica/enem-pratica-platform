"use client";

import { useState } from "react";
import { Role, ROLES, ROLE_LABELS } from "@/src/ui/constants";
import { TeachingStaffModel } from "@/src/services/api/models";
import { useValidation } from "@/src/ui/hooks";
import { ZodValidation } from "@/src/services/validation/zod/zod-validation";
import {
  newUserSchema,
  NewUserSchema,
} from "@/src/services/validation/zod/schemas/new-user.schema";
import { makeUserService } from "@/src/services/api/factories";

type NewUserFormData = {
  name: string;
  username: string;
  password: string;
  role: Role | "";
  teacherId: string;
};

type UserCreatorRole = typeof ROLES.ADMIN | typeof ROLES.SUPER_ADMIN;

const ROLE_CREATION_PERMISSIONS: Record<UserCreatorRole, Role[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(ROLES),
  [ROLES.ADMIN]: [ROLES.STUDENT, ROLES.TEACHER],
};

type NewUserFormProps = {
  teachingStaff: TeachingStaffModel[];
  currentUserRole: UserCreatorRole;
};

const newUserValidator = new ZodValidation(newUserSchema);

export function NewUserForm({
  teachingStaff,
  currentUserRole,
}: NewUserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NewUserFormData>({
    name: "",
    username: "",
    password: "",
    role: "",
    teacherId: "",
  });
  const { errors, validate } = useValidation(newUserValidator);

  const getAvailableRoles = (): Role[] => {
    return ROLE_CREATION_PERMISSIONS[currentUserRole];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "role" && value !== ROLES.STUDENT) {
        newData.teacherId = "";
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate(formData as unknown as NewUserSchema);

    if (isValid) {
      setIsLoading(true);

      try {
        const newUser = await makeUserService().create(formData);
        alert(`${newUser.name}, foi cadastrado com sucesso.`);
        setFormData({
          name: "",
          username: "",
          password: "",
          role: "",
          teacherId: "",
        });
      } catch {
        alert("Erro ao cadastrar usuário.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Campo: Nome Completo */}
      <div className="flex flex-col gap-1.5">
        <label
          className={`text-[10px] font-black uppercase tracking-wider ml-1 transition-colors ${
            errors.name ? "text-(--error) opacity-100" : "opacity-60"
          }`}
        >
          Nome Completo
        </label>
        <input
          required
          type="text"
          name="name"
          className={`input outline-none transition-all ${
            errors.name
              ? "border-(--error) ring-1 ring-(--error) animate-shake focus:border-(--error)"
              : "focus:border-(--accent) focus:ring-4 ring-(--accent)/20"
          }`}
          placeholder="Digite o nome completo..."
          value={formData.name}
          onChange={handleChange}
        />
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            errors.name
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-(--error) text-xs italic mt-1 ml-1">
              {errors.name?.[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Campo: Username */}
      <div className="flex flex-col gap-1.5">
        <label
          className={`text-[10px] font-black uppercase tracking-wider ml-1 transition-colors ${
            errors.username ? "text-(--error) opacity-100" : "opacity-60"
          }`}
        >
          Username
        </label>
        <input
          required
          type="text"
          name="username"
          className={`input outline-none transition-all ${
            errors.username
              ? "border-(--error) ring-1 ring-(--error) animate-shake focus:border-(--error)"
              : "focus:border-(--accent) focus:ring-4 ring-(--accent)/20"
          }`}
          placeholder="Ex: joao.silva"
          value={formData.username}
          onChange={handleChange}
        />
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            errors.username
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-(--error) text-xs italic mt-1 ml-1">
              {errors.username?.[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Campo: Senha */}
      <div className="flex flex-col gap-1.5">
        <label
          className={`text-[10px] font-black uppercase tracking-wider ml-1 transition-colors ${
            errors.password ? "text-(--error) opacity-100" : "opacity-60"
          }`}
        >
          Senha
        </label>
        <input
          required
          type="password"
          name="password"
          className={`input outline-none transition-all ${
            errors.password
              ? "border-(--error) ring-1 ring-(--error) animate-shake focus:border-(--error)"
              : "focus:border-(--accent) focus:ring-4 ring-(--accent)/20"
          }`}
          placeholder="••••••••••••"
          value={formData.password}
          onChange={handleChange}
        />
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            errors.password
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-(--error) text-xs italic mt-1 ml-1">
              {errors.password?.[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Campo: Nível de Permissão */}
      <div className="flex flex-col gap-1.5">
        <label
          className={`text-[10px] font-black uppercase tracking-wider ml-1 transition-colors ${
            errors.role ? "text-(--error) opacity-100" : "opacity-60"
          }`}
        >
          Nível de Permissão
        </label>
        <select
          required
          name="role"
          className={`input outline-none transition-all cursor-pointer ${
            errors.role
              ? "border-(--error) ring-1 ring-(--error) animate-shake focus:border-(--error)"
              : "focus:border-(--accent)"
          }`}
          value={formData.role}
          onChange={handleChange}
        >
          <option value="">Selecione um nível...</option>
          {getAvailableRoles().map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            errors.role
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-(--error) text-xs italic mt-1 ml-1">
              {errors.role?.[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Campo Condicional: Professor */}
      {formData.role === ROLES.STUDENT && (
        <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-4 duration-500">
          <label
            className={`text-[10px] font-black uppercase tracking-wider ml-1 transition-colors ${
              errors.teacherId ? "text-(--error)" : "text-(--accent)"
            }`}
          >
            Vincular ao Professor
          </label>
          <select
            required
            name="teacherId"
            className={`input outline-none transition-all cursor-pointer bg-(--accent)/5 ${
              errors.teacherId
                ? "border-(--error) ring-1 ring-(--error) animate-shake focus:border-(--error)"
                : "border-(--accent)/50 focus:border-(--accent)"
            }`}
            value={formData.teacherId}
            onChange={handleChange}
          >
            <option value="">Escolha um professor disponível...</option>
            {teachingStaff.map(({ user, studentsCount }) => (
              <option key={user.id} value={user.id}>
                {user.name} | {ROLE_LABELS[user.role]} ({studentsCount}{" "}
                {studentsCount === 1 ? "aluno" : "alunos"})
              </option>
            ))}
          </select>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              errors.teacherId
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-(--error) text-xs italic mt-1 ml-1">
                {errors.teacherId?.[0]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Botão Submeter */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="button-primary w-full py-3 shadow-lg shadow-(--accent)/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full ananimate-shakeimate-spin" />
              Cadastrando...
            </span>
          ) : (
            "Cadastrar Usuário"
          )}
        </button>
      </div>
    </form>
  );
}
