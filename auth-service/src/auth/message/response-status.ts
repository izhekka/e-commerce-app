import { HttpStatus } from '@nestjs/common';

export class StatusValue {

  constructor(
    readonly status: number,
    readonly message: string
  ) {}
}

export const ResponseStatus = {
  SUCCESS: new StatusValue(HttpStatus.OK, null),
  CREATED: new StatusValue(HttpStatus.CREATED, null),
  ALREADY_EXISTS: new StatusValue(HttpStatus.CONFLICT, 'User with such email already exists'),
  NOT_FOUND: new StatusValue(HttpStatus.UNAUTHORIZED, 'User not found'),
  PASSWORD_INCORRECT: new StatusValue(HttpStatus.UNAUTHORIZED, 'Password is incorrect'),
  TOKEN_INVALID: new StatusValue(HttpStatus.FORBIDDEN, 'Token is invalid')
}