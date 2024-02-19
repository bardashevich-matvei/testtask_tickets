import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TicketModule } from './api/ticket/ticket.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppLoggerMiddleware } from './utils/logger.utils';
import { UserModule } from './api/user/user.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/Tickets'), TicketModule, UserModule]
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AppLoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
	}
}
