import { PrismaService } from '@app/prisma/prisma.service';
import { CreateRoleDto } from '@app/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@app/roles/dto/update-role.dto';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Role[]> {
    return await this.prisma.role.findMany();
  }

  async findById(id: number): Promise<Role> {
    return await this.prisma.role.findFirst({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Role> {
    return await this.prisma.role.findFirst({
      where: { name },
    });
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const roleByName = await this.findByName(createRoleDto.name);
    if (roleByName) {
      throw new UnprocessableEntityException(
        'Role with this name already exists',
      );
    }
    return await this.prisma.role.create({
      data: createRoleDto,
    });
  }

  async updateById(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    if (id !== updateRoleDto.id) {
      throw new UnprocessableEntityException('Ids do not match');
    }
    const roleById = await this.findById(id);
    if (!roleById) {
      throw new NotFoundException('No role with this id');
    }
    if (updateRoleDto.name && updateRoleDto.name !== roleById.name) {
      const roleByName = await this.findByName(updateRoleDto.name);
      if (roleByName) {
        throw new UnprocessableEntityException('Role must be unique');
      }
    }
    return await this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async deleteById(id: number): Promise<Role> {
    return await this.prisma.role
      .delete({
        where: { id },
      })
      .catch(() => {
        throw new UnprocessableEntityException();
      });
  }
}
