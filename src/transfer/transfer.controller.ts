import { Body, Controller, Post } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/transfers')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transfer' })
  @ApiBody({
    type: CreateTransferDto,
    description: 'Create a new transfer',
    examples: {
      example1: {
        summary: 'Example of a transfer',
        value: {
          sender_password: '123456',
          sender_cpf_or_email: '12345678901',
          receiver_cpf_cnpj_or_email: '12345678901234',
          amount: 100,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The transfer has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid sender, receiver or amount.',
  })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to perform this action.',
  })
  async createTransfer(@Body() createTransferDto: CreateTransferDto) {
    return this.transferService.createTransfer(createTransferDto);
  }
}
