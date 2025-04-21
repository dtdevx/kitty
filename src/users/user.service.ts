import * as bcrypt from 'bcrypt';

import { PrismaService } from '@app/prisma/prisma.service';
import { RoleService } from '@app/roles/role.service';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { UpdateUserDto } from '@app/users/dto/update-user.dto';
import {
  UserResponseInterface,
  UsersResponseInterface,
} from '@app/users/types/user-response.interface';
import { UserWithRoles } from '@app/users/types/user.type';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RoleService,
  ) {}

  async findAll(): Promise<UserWithRoles[]> {
    const users = await this.prisma.user.findMany({
      include: { roles: true },
    });
    return users;
  }

  async findById(id: number): Promise<UserWithRoles> {
    const user = await this.prisma.user.findFirst({
      where: { id },
      include: { roles: true },
    });
    return user;
  }

  async findByEmail(email: string): Promise<UserWithRoles> {
    return await this.prisma.user.findFirst({
      where: { email },
      include: {
        roles: true,
      },
    });
  }

  async getPasswordHashById(id: number): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    return user.password;
  }

  async create(createUserDto: CreateUserDto): Promise<UserWithRoles> {
    const userByEmail = await this.findByEmail(createUserDto.email);
    if (userByEmail) {
      throw new UnprocessableEntityException(
        'User with this email already exists',
      );
    }
    const password = await bcrypt.hash(createUserDto.password, 10);
    const isActive = true;
    const profilePic = '';
    const userRole = await this.roleService.findByName('user');
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password,
        profilePic,
        isActive,
        roles: {
          connect: [
            { userId_roleId: { userId: userByEmail.id, roleId: userRole.id } },
          ],
        },
      },
      include: { roles: true },
      omit: { password: true },
    });
    return user;
  }

  async updateById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithRoles> {
    const updatedUser = { ...updateUserDto };
    if (id !== updatedUser.id) {
      throw new UnprocessableEntityException('Ids do not match');
    }
    const userById = await this.findById(id);
    if (!userById) {
      throw new NotFoundException('No user with this id');
    }
    if (updatedUser.email && updatedUser.email !== userById.email) {
      const userByEmail = await this.findByEmail(updatedUser.email);
      if (userByEmail) {
        throw new UnprocessableEntityException(
          'Email already assigned to other user',
        );
      }
    }
    if (updatedUser.password) {
      updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updatedUser,
      include: { roles: true },
    });

    return user;
  }

  async deleteById(id: number): Promise<UserWithRoles> {
    const user = await this.prisma.user
      .delete({
        where: { id },
        include: { roles: true },
      })
      .catch(() => {
        throw new UnprocessableEntityException();
      });
    return user;
  }

  buildUsersResponse(users: UserWithRoles[]): UsersResponseInterface {
    return {
      users,
    };
  }

  buildUserResponse(user: UserWithRoles): UserResponseInterface {
    return {
      user,
    };
  }
}
