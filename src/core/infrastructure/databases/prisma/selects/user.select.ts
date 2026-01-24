import { Prisma } from "@/src/generated/prisma/client";

export const userPublicSelect = {
  id: true,
  name: true,
  username: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type UserPublicPrisma = Prisma.UserGetPayload<{
  select: typeof userPublicSelect;
}>;
