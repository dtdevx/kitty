import { PrismaService } from '@app/prisma/prisma.service';
import { RoleService } from '@app/roles/role.service';
import { UserController } from '@app/users/user.controller';
import { UserService } from '@app/users/user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService, RoleService],
  exports: [UserService],
})
export class UserModule {}
