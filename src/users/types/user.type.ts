import { Prisma } from "prisma/generated/prisma/client";

export type FullUserWithRoles = Prisma.UserGetPayload<{include: { roles: true } }>;
export type UserWithRoles = Omit<FullUserWithRoles, 'password'>;
