import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomBadRequestException extends HttpException {
  constructor(content: string, field: string, toast: boolean) {
    super(
      {
        message: [field + '.' + content],
        error: 'Validate failed',
        statusCode: HttpStatus.BAD_REQUEST,
        toast: toast,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
