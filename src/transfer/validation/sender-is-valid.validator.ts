import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../../user/user.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class SenderIsValidValidator implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(value: any): Promise<boolean> {
    const { sender_password, sender_cpf_or_email } = value;

    return !(await this.userService.senderIsValid(
      sender_cpf_or_email,
      sender_password,
    ));
  }
}

export function SenderIsValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: SenderIsValidValidator,
    });
  };
}
