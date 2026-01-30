import { Role, ROLES } from "@/src/web/config";

function isValidRole(role: string | null): role is Role {
  return Object.values(ROLES).includes(role as Role);
}

export function extractUserRole(headersList: Headers): Role {
  const role = headersList.get("x-user-role");

  if (!isValidRole(role)) {
    // TODO: Implementar erros personalizados
    throw new Error("Invalid x-user-role header");
  }

  return role;
}