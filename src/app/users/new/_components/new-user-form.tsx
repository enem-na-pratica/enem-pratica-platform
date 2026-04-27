'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { InstructorWithStudentCount, makeUserService } from '@/src/web/api';
import { ROLES, ROLE_LABELS, Role } from '@/src/web/config';
import { useNotify } from '@/src/web/hooks';
import { CreateUserFormValues, createUserSchema } from '@/src/web/validation';

type UserCreatorRole = typeof ROLES.ADMIN | typeof ROLES.SUPER_ADMIN;

const ROLE_CREATION_PERMISSIONS: Record<UserCreatorRole, Role[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(ROLES),
  [ROLES.ADMIN]: [ROLES.STUDENT, ROLES.TEACHER],
};

type NewUserFormProps = {
  listInstructors: InstructorWithStudentCount[];
  currentUserRole: UserCreatorRole;
};

/**
 * TODO: Refactor needed
 *
 * Reasons:
 * - Component is too long and hard to scan
 * - Repeated markup for inputs and error handling
 * - Business rules mixed with presentation logic
 * - Difficult to test and maintain
 *
 * This should be split into smaller components and hooks.
 */
export function NewUserForm({
  listInstructors,
  currentUserRole,
}: NewUserFormProps) {
  const { notify } = useNotify();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      username: '',
      password: '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      role: '' as any, // A cast is necessary because the initial value is empty, but the type expects Enum.
      teacherId: undefined,
    },
  });

  const selectedRole = useWatch({
    control,
    name: 'role',
  });

  useEffect(() => {
    if (selectedRole !== ROLES.STUDENT) {
      setValue('teacherId', undefined);
    }
  }, [selectedRole, setValue]);

  const getAvailableRoles = (): Role[] => {
    return ROLE_CREATION_PERMISSIONS[currentUserRole];
  };

  const onSubmit = async (data: CreateUserFormValues) => {
    try {
      const newUser = await makeUserService().create(data);

      notify({
        type: 'success',
        message: `${newUser.name} foi cadastrado com sucesso.`,
        description: 'As credenciais já estão ativas no sistema.',
      });

      reset();
    } catch {
      notify({
        type: 'error',
        message: 'Erro ao cadastrar usuário.',
        description: 'Verifique os dados ou tente novamente mais tarde.',
      });
    }
  };

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Full Name Field */}
      <div className="flex flex-col gap-1.5">
        <label
          className={`ml-1 text-[10px] font-black tracking-wider uppercase transition-colors ${
            errors.name ? 'text-(--error) opacity-100' : 'opacity-60'
          }`}
        >
          Nome Completo
        </label>
        <input
          type="text"
          className={`input transition-all outline-none ${
            errors.name
              ? 'animate-shake border-(--error) ring-1 ring-(--error) focus:border-(--error)'
              : 'ring-(--accent)/20 focus:border-(--accent) focus:ring-4'
          }`}
          placeholder="Digite o nome completo..."
          {...register('name')}
        />
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            errors.name
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <p className="mt-1 ml-1 text-xs text-(--error) italic">
              {errors.name?.message}
            </p>
          </div>
        </div>
      </div>

      {/* Username Field */}
      <div className="flex flex-col gap-1.5">
        <label
          className={`ml-1 text-[10px] font-black tracking-wider uppercase transition-colors ${
            errors.username ? 'text-(--error) opacity-100' : 'opacity-60'
          }`}
        >
          Username
        </label>
        <input
          type="text"
          className={`input transition-all outline-none ${
            errors.username
              ? 'animate-shake border-(--error) ring-1 ring-(--error) focus:border-(--error)'
              : 'ring-(--accent)/20 focus:border-(--accent) focus:ring-4'
          }`}
          placeholder="Ex: joao.silva"
          {...register('username')}
        />
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            errors.username
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <p className="mt-1 ml-1 text-xs text-(--error) italic">
              {errors.username?.message}
            </p>
          </div>
        </div>
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-1.5">
        <label
          className={`ml-1 text-[10px] font-black tracking-wider uppercase transition-colors ${
            errors.password ? 'text-(--error) opacity-100' : 'opacity-60'
          }`}
        >
          Senha
        </label>
        <input
          type="password"
          className={`input transition-all outline-none ${
            errors.password
              ? 'animate-shake border-(--error) ring-1 ring-(--error) focus:border-(--error)'
              : 'ring-(--accent)/20 focus:border-(--accent) focus:ring-4'
          }`}
          placeholder="••••••••••••"
          {...register('password')}
        />
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            errors.password
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <p className="mt-1 ml-1 text-xs text-(--error) italic">
              {errors.password?.message}
            </p>
          </div>
        </div>
      </div>

      {/* Role Field */}
      <div className="flex flex-col gap-1.5">
        <label
          className={`ml-1 text-[10px] font-black tracking-wider uppercase transition-colors ${
            errors.role ? 'text-(--error) opacity-100' : 'opacity-60'
          }`}
        >
          Nível de Permissão
        </label>
        <select
          className={`input cursor-pointer transition-all outline-none ${
            errors.role
              ? 'animate-shake border-(--error) ring-1 ring-(--error) focus:border-(--error)'
              : 'focus:border-(--accent)'
          }`}
          {...register('role')}
        >
          <option value="">Selecione um nível...</option>
          {getAvailableRoles().map((role) => (
            <option
              key={role}
              value={role}
            >
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            errors.role
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <p className="mt-1 ml-1 text-xs text-(--error) italic">
              {errors.role?.message}
            </p>
          </div>
        </div>
      </div>

      {/* Conditional Field: Professor */}
      {selectedRole === ROLES.STUDENT && (
        <div className="animate-in slide-in-from-top-4 flex flex-col gap-1.5 duration-500">
          <label
            className={`ml-1 text-[10px] font-black tracking-wider uppercase transition-colors ${
              errors.teacherId ? 'text-(--error)' : 'text-(--accent)'
            }`}
          >
            Vincular ao Professor
          </label>
          <select
            className={`input cursor-pointer bg-(--accent)/5 transition-all outline-none ${
              errors.teacherId
                ? 'animate-shake border-(--error) ring-1 ring-(--error) focus:border-(--error)'
                : 'border-(--accent)/50 focus:border-(--accent)'
            }`}
            {...register('teacherId')}
          >
            <option value="">Escolha um professor disponível...</option>
            {listInstructors.map(({ instructor, studentsCount }) => (
              <option
                key={instructor.id}
                value={instructor.id}
              >
                {instructor.name} | {ROLE_LABELS[instructor.role]} (
                {studentsCount} {studentsCount === 1 ? 'aluno' : 'alunos'})
              </option>
            ))}
          </select>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              errors.teacherId
                ? 'grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <p className="mt-1 ml-1 text-xs text-(--error) italic">
                {errors.teacherId?.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="button-primary w-full py-3 shadow-(--accent)/10 shadow-lg transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Cadastrando...
            </span>
          ) : (
            'Cadastrar Usuário'
          )}
        </button>
      </div>
    </form>
  );
}
