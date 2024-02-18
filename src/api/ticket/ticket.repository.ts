import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './schemas/ticket.schema';
import { Model } from 'mongoose';

@Injectable()
export class TicketRepository {
	constructor(
		@InjectModel(Ticket.name)
		private ticketModel: Model<Ticket>,
	) { }

	async create(ticket: any): Promise<any> {
		const savedTicket = new this.ticketModel(ticket);
		await savedTicket.save();
		return savedTicket.toObject();
	}
}