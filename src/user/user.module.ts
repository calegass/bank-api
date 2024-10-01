import { Module } from '@nestjs/common';
import { UniqueFieldValidator } from './validation/unique-field.validator';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UniqueFieldValidator],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
