import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './transfer.entity';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { SenderIsValidValidator } from './validation/sender-is-valid.validator';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer]), UserModule],
  providers: [TransferService, SenderIsValidValidator],
  controllers: [TransferController],
})
export class TransferModule {}
