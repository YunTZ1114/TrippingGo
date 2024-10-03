import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      path: request.url,
      message:
        exception instanceof HttpException
          ? exception.getResponse()
          : {
              message: 'Internal server error',
              error: 'Internal server error',
              statusCode: 500,
            },
    };
    if (exception instanceof Error) {
      console.error('Error occurred:', exception);
    } else {
      console.error('Error occurred:', {
        statusCode: status,
        message: exception,
      });
    }

    return response.status(status).json(errorResponse.message);
  }
}
