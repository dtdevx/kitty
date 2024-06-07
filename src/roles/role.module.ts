import { PrismaService } from '@app/prisma/prisma.service';
import { RoleController } from '@app/roles/role.controller';
import { RoleService } from '@app/roles/role.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [RoleController],
  providers: [RoleService, PrismaService],
  exports: [RoleService],
})
export class RoleModule {}
