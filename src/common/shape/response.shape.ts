import { HttpStatus } from '@nestjs/common';

export interface ResponseShape<T> {
  data: T;
  statusCode: HttpStatus;
  message: string[];
}
