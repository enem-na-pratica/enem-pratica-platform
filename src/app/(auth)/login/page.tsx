"use client";

import { useRouter } from "next/navigation";
import { makeAuthService } from "@/src/web/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/src/web/validation";

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await makeAuthService().login(data);
      router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError("root", {
        type: "manual",
        message: err.message || "Erro ao realizar login.",
      });
    }
  };

  return (
    <main className="container-center font-sans">
      <div className="card card-sm">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-foreground">
          Acesso
          <br />
          ENEM na Prática
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Username field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-medium text-foreground">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              className={`input ${errors.username ? "border-red-500" : ""}`}
              autoComplete="username"
              placeholder="your_username"
            />
            {errors.username && (
              <span className="text-red-500 text-xs">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium text-foreground">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`input ${errors.password ? "border-red-500" : ""}`}
              autoComplete="current-password"
              placeholder="********"
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* API Error */}
          {errors.root && (
            <p
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm font-semibold"
              role="alert"
            >
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="button-primary w-full mt-2 disabled:opacity-50"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
