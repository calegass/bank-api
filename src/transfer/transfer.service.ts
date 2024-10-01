import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Transfer } from './transfer.entity';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransferDto } from './dto/create-transfer.dto';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { User } from '../user/user.entity';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private transfersRepository: Repository<Transfer>,
    private userService: UserService,
  ) {}

  async createTransfer(createTransferDto: CreateTransferDto) {
    const {
      sender_password,
      sender_cpf_or_email,
      receiver_cpf_cnpj_or_email,
      amount,
    } = createTransferDto;

    const sender = await this.userService.findByCpfOrEmail(sender_cpf_or_email);
    if (!sender || !(await bcrypt.compare(sender_password, sender.password))) {
      throw new HttpException(
        'Sender not found or invalid password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const receiver = await this.userService.findByCpfOrEmail(
      receiver_cpf_cnpj_or_email,
    );
    if (!receiver) {
      throw new HttpException('Receiver not found', HttpStatus.BAD_REQUEST);
    }

    sender.balance = parseFloat(String(sender.balance));
    receiver.balance = parseFloat(String(receiver.balance));

    const transfer = new Transfer();
    transfer.sender = sender;
    transfer.receiver = receiver;
    transfer.amount = amount;
    transfer.status = 'pending';
    transfer.created_at = new Date();

    await this.transfersRepository.save(transfer);

    if (sender.balance < amount) {
      transfer.status = 'failed';
      await this.transfersRepository.save(transfer);
      throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
    }

    try {
      await axios.get('https://util.devi.tools/api/v2/authorize');
    } catch (error) {
      transfer.status = 'failed';
      await this.transfersRepository.save(transfer);
      throw new HttpException(
        'Failed to authorize transfer: ' + error.message,
        HttpStatus.FORBIDDEN,
      );
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await this.userService.updateUser(sender);
    await this.userService.updateUser(receiver);

    await this.sendNotification(receiver, amount);

    transfer.status = 'successful';

    await this.transfersRepository.save(transfer);

    return;
  }

  private async sendNotification(receiver: User, amount: number) {
    try {
      await axios.post('https://util.devi.tools/api/v1/notify', {
        to: receiver.email,
        message: `You have received R$${amount} from ${receiver.name}`,
      });
    } catch (error) {
      console.error('Failed to send notification...', error.message);
    }
  }
}
