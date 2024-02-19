import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './schemas/ticket.schema';
import { Model } from 'mongoose';
import { SearchRequest } from 'libs/search/SearchRequest';
import { mapSearchRequestForMongo } from '@app/utils/search.utils';
import TicketResponseDto from '@libs/dtos/Tickets/ticket-reposne.dto';

@Injectable()
export class TicketRepository {
	constructor(
		@InjectModel(Ticket.name)
		private ticketModel: Model<Ticket>,
	) { }

	async create(ticket: any): Promise<any> {
		const savedTicket = new this.ticketModel(ticket);
		await savedTicket.save();
		return new TicketResponseDto(savedTicket.toObject());
	}

	async findAll(filter?: any, limit?: number, offset?: number): Promise<any[]> {
		const selector: SearchRequest = { limit: limit, offset: offset };
		const { queryOptions } = mapSearchRequestForMongo(selector);

		return (await this.ticketModel.find(filter, null, queryOptions).lean().exec()).map(
			(item) => new TicketResponseDto(item),
		);
	}

	async update(id: string, ticket: any): Promise<TicketResponseDto> {
		const updatedTicket = await this.ticketModel
			.findByIdAndUpdate(id, ticket, { new: true })
			.lean()
			.exec();
		
		if (!updatedTicket) {
			throw new BadRequestException(`Ticket not found!`);
		}
		return new TicketResponseDto(updatedTicket);
	}

	async delete(id: string): Promise<any> {
		const deletedTicket = await this.ticketModel.findByIdAndRemove(id).lean().exec();
		return new TicketResponseDto(deletedTicket || {});
	}

	async findOneById(id: string): Promise<any> {
		const user = await this.ticketModel.findById(id).lean().exec();
		return new TicketResponseDto(user || {});
	}

	async updateMany(filter?: any, data?: any): Promise<any> {
		const updatedTickets = await this.ticketModel
			.updateMany(filter, data)
			.lean()
			.exec();
		
		console.log(updatedTickets);
		
		if (!updatedTickets) {
			throw new BadRequestException(`Ticket not found!`);
		}

		return updatedTickets;
	}
}