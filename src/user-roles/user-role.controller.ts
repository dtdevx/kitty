import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { AddUserRoleDto } from '@app/user-roles/dto/add-user-role.dto';
import { RemoveUserRoleDto } from '@app/user-roles/dto/remove-user-role.dto';
import { UserRoleService } from '@app/user-roles/user-role.service';
import { UserResponseInterface } from '@app/users/types/user-response.interface';
import { UserService } from '@app/users/user.service';
import {
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('UserRoles')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('user-roles')
export class UserRoleController {
  constructor(
    private readonly userRoleService: UserRoleService,
    private readonly userService: UserService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post()
  async addUserRole(
    @Body() addUserRoleDto: AddUserRoleDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userRoleService.addUserRole(addUserRoleDto);
    return this.userService.buildUserResponse(user);
  }

  @UsePipes(new ValidationPipe())
  @Delete()
  async removeUserRole(
    @Body() removeUserRoleDto: RemoveUserRoleDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userRoleService.removeUserRole(removeUserRoleDto);
    return this.userService.buildUserResponse(user);
  }
}
