import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly id: number;

  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  readonly name: string;

  @IsOptional()
  @MaxLength(80)
  @ApiProperty()
  readonly description: string;
}
