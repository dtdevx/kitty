import { UserType } from '@app/users/types/user.type';

export interface UserResponseInterface {
  user: UserType;
}

export interface UsersResponseInterface {
  users: UserType[];
}
