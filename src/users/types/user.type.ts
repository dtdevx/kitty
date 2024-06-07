import { Role, User } from '@prisma/client';

export type UserType = Omit<User, 'password'> & { roles: Role[] };
