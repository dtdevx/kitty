import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  readonly password: string;
}
