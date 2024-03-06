import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(500).json({
      message: ['die.server'],
      error: exception.message,
      statusCode: 500,
      toast: true,
    });
  }
}
