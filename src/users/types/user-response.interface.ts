import { UserWithRoles } from '@app/users/types/user.type';

export interface UserResponseInterface {
  user: UserWithRoles;
}

export interface UsersResponseInterface {
  users: UserWithRoles[];
}
