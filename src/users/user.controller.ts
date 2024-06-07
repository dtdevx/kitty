import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { UpdateUserDto } from '@app/users/dto/update-user.dto';
import {
  UserResponseInterface,
  UsersResponseInterface,
} from '@app/users/types/user-response.interface';
import { UserType } from '@app/users/types/user.type';
import { UserService } from '@app/users/user.service';
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

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UsersResponseInterface> {
    const users = (await this.userService.findAll()) as UserType[];
    return this.userService.buildUsersResponse(users);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserResponseInterface> {
    const user = (await this.userService.findById(+id)) as UserType;
    return this.userService.buildUserResponse(user);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async createOne(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.create(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  async updateOne(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateById(+id, updateUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number): Promise<UserResponseInterface> {
    const user = await this.userService.deleteById(+id);
    return this.userService.buildUserResponse(user);
  }
}
