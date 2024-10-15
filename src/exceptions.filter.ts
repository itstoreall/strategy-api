import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { LoggerService } from './logger/logger.service';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

type ResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new LoggerService(ExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const ResponseObj: ResponseObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      ResponseObj.statusCode = exception.getStatus();
      ResponseObj.response = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      ResponseObj.statusCode = 422;
      ResponseObj.response = exception.message.replaceAll(/\n/g, ' ');
    } else {
      ResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      ResponseObj.response = 'Internal Server Error';
    }

    response.status(ResponseObj.statusCode).json(ResponseObj);

    this.logger.error(ResponseObj.response, ExceptionsFilter.name);

    super.catch(exception, host);
  }
}
