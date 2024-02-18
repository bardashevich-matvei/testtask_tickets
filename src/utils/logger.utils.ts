import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		console.log(`req:`, {
			headers: req.headers,
			body: req.body,
			originalUrl: req.url,
			method: req.method
		});

		next();
	}
}
