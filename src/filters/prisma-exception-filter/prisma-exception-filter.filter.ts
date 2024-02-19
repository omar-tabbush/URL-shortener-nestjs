import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { startCase } from 'lodash';
@Catch()
export class PrismaExceptionFilterFilter<T>
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    //what is causing the error
    const tableName = exception.meta?.modelName;
    const columnName = Array.isArray(exception.meta?.target)
      ? exception.meta?.target.join(', ')
      : exception.meta?.target ?? '';

    switch (exception.code) {
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message: tableName
            ? `The ${startCase(tableName)} not found`
            : message,
        });
        break;
      }
      case 'P2002': {
        //unique constraint error
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: `The ${startCase(columnName)} already taken please use another one`,
        });
        break;
      }
      default:
        // default 500 error code
        super.catch(exception, host);
        break;
    }
  }
}
