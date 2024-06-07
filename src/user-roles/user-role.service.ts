import { PrismaService } from '@app/prisma/prisma.service';
import { RoleService } from '@app/roles/role.service';
import { AddUserRoleDto } from '@app/user-roles/dto/add-user-role.dto';
import { RemoveUserRoleDto } from '@app/user-roles/dto/remove-user-role.dto';
import { UserType } from '@app/users/types/user.type';
import { UserService } from '@app/users/user.service';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class UserRoleService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  async addUserRole(addUserRoleDto: AddUserRoleDto): Promise<UserType> {
    const role = this.roleService.findById(addUserRoleDto.roleId);
    if (!role) {
      throw new UnprocessableEntityException('This role does not exist.');
    }
    const user = await this.userService.findById(addUserRoleDto.userId);
    if (!user) {
      throw new UnprocessableEntityException('This user does not exist.');
    }
    const userRoleExists = !!user.roles.filter(
      (role) => role.id === addUserRoleDto.roleId,
    ).length;
    if (userRoleExists) {
      throw new UnprocessableEntityException(
        'The role is already attached to this user',
      );
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: addUserRoleDto.userId },
      data: {
        roles: {
          create: {
            roleId: addUserRoleDto.roleId,
          },
        },
      },
      include: { roles: { include: { role: true } } },
    });

    return {
      ...updatedUser,
      roles: this.userService.hydrateUserRoles(updatedUser.roles),
    };
  }

  async removeUserRole(
    removeUserRoleDto: RemoveUserRoleDto,
  ): Promise<UserType> {
    const role = this.roleService.findById(removeUserRoleDto.roleId);
    if (!role) {
      throw new UnprocessableEntityException('This role does not exist.');
    }
    const user = await this.userService.findById(removeUserRoleDto.userId);
    if (!user) {
      throw new UnprocessableEntityException('This user does not exist.');
    }
    const userRoleExists = !!user.roles.filter(
      (role) => role.id === removeUserRoleDto.roleId,
    ).length;
    if (!userRoleExists) {
      throw new UnprocessableEntityException(
        'The role is not attached to this user',
      );
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: removeUserRoleDto.userId },
      data: {
        roles: {
          deleteMany: [
            {
              roleId: removeUserRoleDto.roleId,
            },
          ],
        },
      },
      include: { roles: { include: { role: true } } },
    });

    return {
      ...updatedUser,
      roles: this.userService.hydrateUserRoles(updatedUser.roles),
    };
  }
}
