import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './schemas/ticket.schema';
import { FilterQuery, Model } from 'mongoose';
import { SearchRequest } from 'libs/search/SearchRequest';
import { mapSearchRequestForMongo } from '@app/utils/search.utils';

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

	async findAll(filter?: any, limit?: number, offset?: number): Promise<any[]> {
		const selector: SearchRequest = { limit: limit, offset: offset };
		const { queryOptions } = mapSearchRequestForMongo(selector);

		return (await this.ticketModel.find(filter, null, queryOptions).lean().exec()).map(
			(item) => item,
		);
	}

	async update(id: string, ticket: any): Promise<any> {
		const updatedTicket = await this.ticketModel
			.findByIdAndUpdate(id, ticket, { new: true })
			.lean()
			.exec();
		
		if (!updatedTicket) {
			throw new BadRequestException(`Ticket not found!`);
		}
		return updatedTicket;
	}

	async delete(id: string): Promise<any> {
		const deletedTicket = await this.ticketModel.findByIdAndRemove(id).lean().exec();
		return deletedTicket || {};
	}

	async findOneById(id: string): Promise<any> {
		const user = await this.ticketModel.findById(id).lean().exec();
		return user || {};
	}

	async updateMany(tickets: any): Promise<any> {
		const updatedTickets = await this.ticketModel
			.updateMany({_id: { $in: tickets.map((item: Ticket) => item._id )}}, tickets)
			.lean()
			.exec();
		
		if (!updatedTickets) {
			throw new BadRequestException(`Ticket not found!`);
		}
		return updatedTickets;
	}
}