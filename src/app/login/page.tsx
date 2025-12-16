"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error || "Credenciais inválidas. Tente novamente."
        );
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    }
  };

  return (
    <main className={`container-center font-sans`}>
      <div className="card">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-foreground">
          Acesso
          <br />
          ENEM na Prática
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-medium text-foreground">
              Username (your_name)
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input"
              autoComplete="username"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium text-foreground">
              Senha (123456)
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm font-semibold"
              role="alert"
            >
              {error}
            </p>
          )}

          <button type="submit" className="button-primary w-full mt-2">
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
