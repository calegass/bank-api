import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class UniqueFieldValidator implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(value: string, args: any): Promise<boolean> {
    const fieldName = args.constraints[0];
    return !(await this.userService.isFieldUnique(fieldName, value));
  }
}

export function IsUnique(
  fieldName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [fieldName],
      validator: UniqueFieldValidator,
    });
  };
}
