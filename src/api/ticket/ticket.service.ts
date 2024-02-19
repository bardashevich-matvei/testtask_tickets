import { Injectable } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { UserService } from '../user/user.service';
import { throws } from 'assert';
import { Ticket } from './schemas/ticket.schema';
import { User } from '../user/schemas/user.schema';
import { checkReservation } from '@app/utils/checkReservation.utils';

@Injectable()
export class TicketService {
	constructor(
		private readonly ticketRepository: TicketRepository,
		private readonly userService: UserService
	) { }

	async create(movie: any): Promise<any> {
		return this.ticketRepository.create(movie);
	}

	async findAll(limit?: number, offset?: number): Promise<any[]> {
		return this.ticketRepository.findAll(limit, offset);
	}

	async update(id: string, ticket: any): Promise<any> {
		return this.ticketRepository.update(id, ticket);
	}

	async updateMany(tickets: any): Promise<any> {
		return this.ticketRepository.updateMany(tickets);
	}

	async findOne(id: string): Promise<any> {
		return this.ticketRepository.findOneById(id);
	}

	async delete(id: string): Promise<any> {
		return this.ticketRepository.delete(id);
	}

	async reserveAll(body: any): Promise<any> {
		const { user } = body;
		const userInfo = await this.userService.findOne(user.name);
		const allTickets = await this.ticketRepository.findAll();

		allTickets.forEach((item: Ticket) => {
			item.reservedTime = Date.now();
			item.reservedBy = userInfo.name;
		});

		return await this.ticketRepository.updateMany(allTickets);
	}

	async reserveEven(body: any): Promise<any> {
		const { user, ticketIds } = body;
		if ( ticketIds.length % 2 !== 0) {
			throw 'count of the tickets is not even'
		}
		const userInfo = await this.userService.findOne(user.name);
		const tickets = await this.ticketRepository.findAll({
			_id: { $in: ticketIds }
		});

		tickets.forEach((item: Ticket) => {
			item.reservedTime = Date.now();
			item.reservedBy = userInfo.name;
		});

		return await this.ticketRepository.updateMany(tickets);
	}

	async reserveAvoidOne(body: any): Promise<any> {
		const { user, ticketIds } = body;
		const userInfo = await this.userService.findOne(user.name);
		const allTickets = await this.ticketRepository.findAll();
		const tickets = allTickets.filter((item) => ticketIds.includes(item._id));

		if (allTickets.length - tickets.length === 1) {
			throw 'cant leave only 1 ticket available'
		}

		tickets.forEach((item: Ticket) => {
			item.reservedTime = Date.now();
			item.reservedBy = userInfo.name;
		});

		return await this.ticketRepository.updateMany(tickets);
	}

	async buy(body: any): Promise<any> {
		const { userName } = body;
		const userInfo = await this.userService.findOne(userName);
		if (userInfo!) {
			throw 'cant find a user';
		}

		const allReservedTickets = await this.ticketRepository.findAll({resevedBy: userInfo.name});
		const totalAmount = allReservedTickets.reduce((acc, item) => acc = item.price, 0);

		if (userInfo.count < totalAmount) {
			throw 'not enoght money!';
		}

		if (checkReservation(allReservedTickets)) {
			const purchasedTickets = await this.ticketRepository.updateMany(allReservedTickets);
			userInfo.count -= totalAmount;
			await this.userService.updateOne(userInfo);
			return purchasedTickets;
		} else {
			throw 'reservation for some tickets expired';
		}
	}
}
