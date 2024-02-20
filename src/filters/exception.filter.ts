import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { startCase } from 'lodash';
import { nanoid } from 'nanoid';
@Catch()
export class CustomExceptionFilter<T>
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(
    exception: Prisma.PrismaClientKnownRequestError | HttpException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');
    const request = ctx.getRequest();
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path: url } = request;
    const correlationKey = nanoid();
    const userId = request.user?.userId;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      this.logger.error(
        `[${correlationKey}] ${method} ${url} ${userId} ${userAgent} ${ip} HTTP ${status} ERROR: ${message}]`,
      );
      response.status(status).json({
        statusCode: status,
        message,
      });
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      //what is causing the error
      const tableName = exception.meta?.modelName;
      const columnName = Array.isArray(exception.meta?.target)
        ? exception.meta?.target.join(', ')
        : exception.meta?.target ?? '';

      switch (exception.code) {
        case 'P2025': {
          const status = HttpStatus.NOT_FOUND;
          this.logger.error(
            `[${correlationKey}] ${method} ${url} ${userId} ${userAgent} ${ip} PRISMA ${exception.code ?? 'ERROR'}: ${message}`,
          );
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
          this.logger.error(
            `[${correlationKey}] ${method} ${url} ${userId} ${userAgent} ${ip} PRISMA ${exception.code ?? 'ERROR'}: ${message}`,
          );
          response.status(status).json({
            statusCode: status,
            message: `The ${startCase(columnName)} already taken please use another one`,
          });
          break;
        }
        default:
          // still a prisma error but not handled
          this.logger.error(
            `[${correlationKey}] ${method} ${url} ${userId} ${userAgent} ${ip} UNHANDLED PRISMA ${exception.code ?? 'ERROR'}: ${message}`,
          );
          super.catch(exception, host);
          break;
      }
    }
  }
}
