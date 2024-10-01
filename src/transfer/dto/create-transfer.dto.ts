import {
  IsString,
  IsNotEmpty,
  IsPositive,
  Matches,
  Validate,
  IsNumber,
} from 'class-validator';
import { SenderIsValid } from '../validation/sender-is-valid.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransferDto {
  @ApiProperty({
    description: 'password of the sender',
  })
  @IsString()
  @IsNotEmpty({ message: 'Sender password is required' })
  sender_password: string;

  @ApiProperty({
    description: 'CPF or email of the sender',
  })
  @IsString()
  @IsNotEmpty({ message: 'Sender CPF or email is required' })
  @Matches(/^\d{11}$|^[\w.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Sender CPF must be 11 digits or a valid email',
  })
  sender_cpf_or_email: string;

  @ApiProperty({
    description: 'CPF or email of the receiver',
  })
  @IsString()
  @IsNotEmpty({ message: 'Receiver CPF or email is required' })
  @Matches(/^\d{11}$|^\d{14}$|^[\w.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Receiver CPF/CNPJ must be 11 digits or a valid email',
  })
  receiver_cpf_cnpj_or_email: string;

  @ApiProperty({
    description: 'amount to be transferred',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @Validate(SenderIsValid, {
    message: 'Sender not found or invalid credentials',
  })
  sender: { sender_password: string; sender_cpf_or_email: string };
}
