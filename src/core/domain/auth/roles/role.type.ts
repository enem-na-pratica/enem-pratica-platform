import { ROLES } from "./roles.constants";

export type Role = typeof ROLES[keyof typeof ROLES];
