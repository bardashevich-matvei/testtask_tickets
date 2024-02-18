import { Injectable } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';

@Injectable()
export class TicketService {
	constructor(private readonly ticketRepository: TicketRepository) { }

	async create(movie: any): Promise<any> {
		return this.ticketRepository.create(movie);
	}

	async findAll(limit?: number, offset?: number): Promise<any[]> {
		return this.ticketRepository.findAll(limit, offset);
	}

	async update(id: string, ticket: any): Promise<any> {
		return this.ticketRepository.update(id, ticket);
	}

	async findOne(id: string): Promise<any> {
		return this.ticketRepository.findOneById(id);
	}

	async delete(id: string): Promise<any> {
		return this.ticketRepository.delete(id);
	}
}
