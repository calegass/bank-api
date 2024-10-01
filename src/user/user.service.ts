import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.email = createUserDto.email;
    user.name = createUserDto.name;
    user.cpf_cnpj = createUserDto.cpf_cnpj;
    user.balance = createUserDto.balance || 0;

    user.password = await bcrypt.hash(createUserDto.password, 10);

    return this.usersRepository.save(user);
  }

  async isFieldUnique(fieldName: string, value: string): Promise<boolean> {
    if (fieldName === 'email') {
      return this.emailExists(value);
    }
    if (fieldName === 'cpf_cnpj') {
      return this.cpfCnpjExists(value);
    }
    return true;
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return !!user;
  }

  async cpfCnpjExists(cpf_cnpj: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { cpf_cnpj } });
    return !!user;
  }

  async updateUser(user: User) {
    return this.usersRepository.save(user);
  }

  async findByCpfOrEmail(receiver_cpf_cnpj_or_email: string) {
    return this.usersRepository.findOne({
      where: [
        { cpf_cnpj: receiver_cpf_cnpj_or_email },
        { email: receiver_cpf_cnpj_or_email },
      ],
    });
  }

  async senderIsValid(sender_cpf_or_email: string, sender_password: string) {
    if (!sender_cpf_or_email || !sender_password) {
      return false;
    }

    const user = await this.findByCpfOrEmail(sender_cpf_or_email);

    if (!user) {
      return false;
    }

    if (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender_cpf_or_email) &&
      user.cpf_cnpj.length !== 14
    ) {
      return false;
    }

    return await bcrypt.compare(sender_password, user.password);
  }
}
