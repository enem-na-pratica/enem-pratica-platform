"use client";

import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/login");
      } else {
        alert("Falha ao fazer logout. Tente novamente.");
      }
    } catch {
      alert("Ocorreu um erro. Verifique sua conexão ou tente novamente.");
    }
  };

  const handleMe = async () => {
    try {
      const response = await fetch("/api/user/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
      const data = await response.json();
      console.log(data);
      } else {
        alert("Falha ao fazer logout. Tente novamente.");
      }
    } catch {
      alert("Ocorreu um erro. Verifique sua conexão ou tente novamente.");
    }
  };

  return (
    <main className="container-center">
      <div className="card text-center">
        <h1 className="text-2xl font-bold mb-4">Bem-vindo</h1>
        <p className="mb-6">Sistema de Login com DDD + Next.js</p>
        <button
          onClick={handleMe}
          className="button-primary w-full"
        >
          Me
        </button>
        <button
          onClick={handleLogout}
          className="button-primary w-full"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
