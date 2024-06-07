import { PrismaService } from '@app/prisma/prisma.service';
import { RoleService } from '@app/roles/role.service';
import { UserRoleController } from '@app/user-roles/user-role.controller';
import { UserRoleService } from '@app/user-roles/user-role.service';
import { UserService } from '@app/users/user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UserRoleController],
  providers: [UserRoleService, PrismaService, UserService, RoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
