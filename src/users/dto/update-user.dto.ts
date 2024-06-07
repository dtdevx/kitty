import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly id: number;

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  readonly email: string;

  @IsOptional()
  @ApiProperty()
  readonly name: string;

  @IsOptional()
  @ApiProperty()
  readonly password: string;

  @IsOptional()
  @ApiProperty()
  readonly profilePic: string;

  @IsOptional()
  @ApiProperty()
  readonly isActive: boolean;
}
