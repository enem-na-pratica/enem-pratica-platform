import { Role, ROLES } from "@/src/ui/constants";

export function getRoleFromHeaders(headersList: Headers): Role {
  const role = headersList.get("x-user-role");

  // TODO: Implementar erros personalizados
  if (!role || !Object.values(ROLES).includes(role as Role)) {
    throw new Error("Invalid x-user-role header");
  }

  return role as Role;
}