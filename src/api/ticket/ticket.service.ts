import { Injectable } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';

@Injectable()
export class TicketService {
	constructor(private readonly ticketRepository: TicketRepository) { }

	async create(movie: any): Promise<any> {
		return this.ticketRepository.create(movie);
	}
}
