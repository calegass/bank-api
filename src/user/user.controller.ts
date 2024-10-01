import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user/store' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Create a new user/store',
    examples: {
      example1: {
        summary: 'Example with a user',
        value: {
          name: 'Anakin Skywalker',
          cpf_cnpj: '12345678901',
          email: 'anakin@mail.com',
          password: '123456',
          balance: 1000,
        },
      },
      example2: {
        summary: 'Example with a store',
        value: {
          name: 'Darth Vader S/A',
          cpf_cnpj: '12345678901234',
          email: 'vader@mail.com',
          password: '654321',
          balance: 100,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The user/store has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid name, CPF/CNPJ, email or password.',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }
}
