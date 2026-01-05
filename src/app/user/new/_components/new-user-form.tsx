"use client";

import { useState } from "react";
import { Role, ROLES } from "@/src/ui/constants";
import { UserModel } from "@/src/ui/application/models";
import { useRouter } from "next/navigation";

type NewUserFormData = {
  name: string;
  username: string;
  password: string;
  role: Role | "";
  teacherId: string;
};

type UserCreatorRole = typeof ROLES.ADMIN | typeof ROLES.SUPERADMIN;

const ROLE_CREATION_PERMISSIONS: Record<UserCreatorRole, Role[]> = {
  [ROLES.SUPERADMIN]: Object.values(ROLES),
  [ROLES.ADMIN]: [ROLES.STUDENT, ROLES.TEACHER],
};

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.STUDENT]: "Estudante",
  [ROLES.TEACHER]: "Professor",
  [ROLES.ADMIN]: "Administrador",
  [ROLES.SUPERADMIN]: "Super Administrador",
};

type NewUserFormProps = {
  teachers: UserModel[];
  currentUserRole: UserCreatorRole;
};

export function NewUserForm({ teachers, currentUserRole }: NewUserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NewUserFormData>({
    name: "",
    username: "",
    password: "",
    role: "",
    teacherId: "",
  });

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
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
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
