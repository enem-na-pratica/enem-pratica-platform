"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
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
        router.refresh();
      } else {
        alert("Falha ao fazer logout. Tente novamente.");
      }
    } catch {
      alert("Ocorreu um erro. Verifique sua conexão ou tente novamente.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Sair
    </button>
  );
}
