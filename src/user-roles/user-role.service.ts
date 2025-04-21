import { PrismaService } from '@app/prisma/prisma.service';
import { RoleService } from '@app/roles/role.service';
import { AddUserRoleDto } from '@app/user-roles/dto/add-user-role.dto';
import { RemoveUserRoleDto } from '@app/user-roles/dto/remove-user-role.dto';
import { UserWithRoles } from '@app/users/types/user.type';
import { UserService } from '@app/users/user.service';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class UserRoleService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  async addUserRole(addUserRoleDto: AddUserRoleDto): Promise<UserWithRoles> {
    const role = await this.roleService.findById(addUserRoleDto.roleId);
    if (!role) {
      throw new UnprocessableEntityException('This role does not exist.');
    }
    const user = await this.userService.findById(addUserRoleDto.userId);
    if (!user) {
      throw new UnprocessableEntityException('This user does not exist.');
    }
    const userRoleExists = !!user.roles.filter(
      (role) => role.roleId === addUserRoleDto.roleId,
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
          connect: [{ userId_roleId: { userId: user.id, roleId: role.id } }],
        },
      },
      include: { roles: true },
    });

    return updatedUser;
  }

  async removeUserRole(
    removeUserRoleDto: RemoveUserRoleDto,
  ): Promise<UserWithRoles> {
    const role = await this.roleService.findById(removeUserRoleDto.roleId);
    if (!role) {
      throw new UnprocessableEntityException('This role does not exist.');
    }
    const user = await this.userService.findById(removeUserRoleDto.userId);
    if (!user) {
      throw new UnprocessableEntityException('This user does not exist.');
    }
    const userRoleExists = !!user.roles.filter(
      (role) => role.roleId === removeUserRoleDto.roleId,
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
          disconnect: [{ userId_roleId: { userId: user.id, roleId: role.id } }],
        },
      },
      include: { roles: true },
    });

    return updatedUser;
  }
}
