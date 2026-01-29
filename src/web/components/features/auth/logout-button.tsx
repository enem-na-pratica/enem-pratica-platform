"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { makeAuthService } from "@/src/web/api/factories";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await makeAuthService().logout();

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      alert("Ocorreu um erro. Verifique sua conexão ou tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`
        button-primary 
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
        bg-(--error)! text-white
      `}
    >
      {isLoading ? "Saindo..." : "Sair"}
    </button>
  );
}
