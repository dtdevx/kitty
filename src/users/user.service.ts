import * as bcrypt from 'bcrypt';

import { PrismaService } from '@app/prisma/prisma.service';
import { RoleService } from '@app/roles/role.service';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { UpdateUserDto } from '@app/users/dto/update-user.dto';
import {
  UserResponseInterface,
  UsersResponseInterface,
} from '@app/users/types/user-response.interface';
import { UserType } from '@app/users/types/user.type';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly omit = {
    password: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RoleService,
  ) {}

  async findAll(omitFields = true): Promise<UserType[]> {
    const users = await this.prisma.user.findMany({
      omit: omitFields ? this.omit : {},
      include: { roles: { include: { role: true } } },
    });
    return users.map((user) => ({
      ...user,
      roles: this.hydrateUserRoles(user.roles),
    }));
  }

  async findById(id: number, omitFields = true): Promise<UserType> {
    const user = await this.prisma.user.findFirst({
      where: { id },
      omit: omitFields ? this.omit : {},
      include: { roles: { include: { role: true } } },
    });
    return {
      ...user,
      roles: this.hydrateUserRoles(user.roles),
    };
  }

  async findByEmail(
    email: string,
    omitFields = true,
  ): Promise<UserType | User> {
    return await this.prisma.user.findFirst({
      where: { email },
      omit: omitFields ? this.omit : {},
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserType> {
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
          create: [{ role: { connect: { id: userRole.id } } }],
        },
      },
      include: { roles: { include: { role: true } } },
    });
    return {
      ...user,
      roles: this.hydrateUserRoles(user.roles),
    };
  }

  async updateById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserType> {
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
      include: { roles: { include: { role: true } } },
    });

    return {
      ...user,
      roles: this.hydrateUserRoles(user.roles),
    };
  }

  async deleteById(id: number): Promise<UserType> {
    const user = await this.prisma.user
      .delete({
        where: { id },
        include: { roles: { include: { role: true } } },
      })
      .catch(() => {
        throw new UnprocessableEntityException();
      });
    return {
      ...user,
      roles: this.hydrateUserRoles(user.roles),
    };
  }

  buildUsersResponse(users: UserType[]): UsersResponseInterface {
    return {
      users,
    };
  }

  buildUserResponse(user: UserType): UserResponseInterface {
    return {
      user,
    };
  }

  hydrateUserRoles(roles: any[]): Role[] {
    return roles.map((userRole) => ({
      id: userRole.role.id,
      name: userRole.role.name,
      description: userRole.role.description,
    }));
  }
}
