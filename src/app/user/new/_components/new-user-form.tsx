"use client";

import { useState } from "react";
import { Role, ROLES, ROLE_LABELS } from "@/src/ui/constants";
import { TeachingStaffModel } from "@/src/services/api/models";
import { useRouter } from "next/navigation";
import { useValidation } from "@/src/ui/hooks";
import { ZodValidation } from "@/src/services/validation/zod/zod-validation";
import {
  newUserSchema,
  NewUserSchema,
} from "@/src/services/validation/zod/schemas/new-user.schema";

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
  const router = useRouter();
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

      // TODO: Implement API call for user creation.
      try {
        console.log("Dados para envio:", formData);
        router.replace("/dashboard");
        router.refresh();
      } catch {
        alert("Erro ao cadastrar usuário.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider opacity-60 ml-1">
          Nome Completo
        </label>
        <input
          required
          type="text"
          name="name"
          className="input focus:border-(--accent) outline-none transition-all ring-(--accent)/20 focus:ring-4"
          placeholder="Digite o nome completo..."
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name &&
          errors.name.map((msg, i) => (
            <p key={i} className="text-(--error) text-sm">
              {msg}
            </p>
          ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider opacity-60 ml-1">
          Username
        </label>
        <input
          required
          type="text"
          name="username"
          className="input focus:border-(--accent) outline-none transition-all ring-(--accent)/20 focus:ring-4"
          placeholder="Ex: joao.silva"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username &&
          errors.username.map((msg, i) => (
            <p key={i} className="text-(--error) text-sm">
              {msg}
            </p>
          ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider opacity-60 ml-1">
          Senha
        </label>
        <input
          required
          type="password"
          name="password"
          className="input focus:border-(--accent) outline-none transition-all ring-(--accent)/20 focus:ring-4"
          placeholder="••••••••••••"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password &&
          errors.password.map((msg, i) => (
            <p key={i} className="text-(--error) text-sm">
              {msg}
            </p>
          ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider opacity-60 ml-1">
          Nível de Permissão
        </label>
        <select
          required
          name="role"
          className="input focus:border-(--accent) outline-none transition-all cursor-pointer"
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
        {errors.role &&
          errors.role.map((msg, i) => (
            <p key={i} className="text-(--error) text-sm">
              {msg}
            </p>
          ))}
      </div>

      {formData.role === ROLES.STUDENT && (
        <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-4 duration-500">
          <label className="text-[10px] font-black uppercase tracking-wider text-(--accent) ml-1">
            Vincular ao Professor
          </label>
          <select
            required
            name="teacherId"
            className="input border-(--accent)/50 focus:border-(--accent) outline-none transition-all cursor-pointer bg-(--accent)/5"
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
          {errors.teacherId &&
            errors.teacherId.map((msg, i) => (
              <p key={i} className="text-(--error) text-sm">
                {msg}
              </p>
            ))}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          className="button-primary w-full py-3 shadow-lg shadow-(--accent)/10 active:scale-[0.98] transition-transform"
        >
          {isLoading ? "Cadastrando..." : "Cadastrar Usuário"}
        </button>
      </div>
    </form>
  );
}
