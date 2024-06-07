import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { CreateRoleDto } from '@app/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@app/roles/dto/update-role.dto';
import { RoleService } from '@app/roles/role.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('Roles')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async findAll(): Promise<Role[]> {
    return await this.roleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Role> {
    return await this.roleService.findById(+id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async createOne(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.roleService.create(createRoleDto);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  async updateOne(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return await this.roleService.updateById(+id, updateRoleDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number): Promise<Role> {
    return await this.roleService.deleteById(+id);
  }
}
