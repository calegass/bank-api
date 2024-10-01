import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { IsUnique } from '../validation/unique-field.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'name of the user/store',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'CPF/CNPJ of the user/store',
  })
  @IsString()
  @IsNotEmpty({ message: 'CPF/CNPJ is required' })
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'CPF/CNPJ must be 11 or 14 digits and contain only numbers',
  })
  @IsUnique('cpf_cnpj', { message: 'CPF/CNPJ already exists' })
  cpf_cnpj: string;

  @ApiProperty({
    description: 'email of the user/store',
  })
  @IsEmail(undefined, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsUnique('email', { message: 'Email already exists' })
  email: string;

  @ApiProperty({
    description: 'password of the user/store (min 6 characters)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'balance of the user/store',
  })
  @IsNumber()
  @IsOptional()
  balance?: number = 0;
}
