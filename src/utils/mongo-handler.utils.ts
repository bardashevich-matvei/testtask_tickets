import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
	catch(exception: MongoError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		let status = 500;
		const message = exception.message;

		if (exception.code === 11000) {
			// duplicate key error
			status = 400;
		}

		response.status(status).json({
			message,
			timestamp: new Date().toISOString(),
			path: request.url,
			method: request.method,
		});
	}
}
