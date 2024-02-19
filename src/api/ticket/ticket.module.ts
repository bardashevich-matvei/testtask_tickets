import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { TicketController } from './ticket.controller';
import { TicketRepository } from './ticket.repository';
import { TicketService } from './ticket.service';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Ticket.name, schema: TicketSchema },
			{ name: User.name, schema: UserSchema }
		])
	],
	controllers: [TicketController],
	providers: [
		TicketService,
		TicketRepository,
		UserService,
		UserRepository
	],
})
export class TicketModule { }