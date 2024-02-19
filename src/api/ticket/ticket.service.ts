import { Injectable } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { UserService } from '../user/user.service';
import { throws } from 'assert';
import { Ticket } from './schemas/ticket.schema';
import { User } from '../user/schemas/user.schema';
import { checkReservation } from '@app/utils/checkReservation.utils';
import { SellingOption } from '@libs/enums/SellingOptions.enum';

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

	async reserve(body: any): Promise<any> {
		const { user, ticketIds } = body;
		const userInfo = await this.userService.findOne(user.name);
		const reservedTickets = await this.ticketRepository.findAll({_id: { $in: ticketIds}});

		reservedTickets.forEach((item: Ticket) => {
			item.reservedTime = Date.now();
			item.reservedBy = userInfo.name;
		});

		return await this.ticketRepository.updateMany(reservedTickets);
	}

	async buy(body: any): Promise<any> {
		const { userName } = body;
		const userInfo = await this.userService.findOne(userName);
		if (userInfo!) {
			throw 'cant find a user';
		}
		
		const allTickets = await this.ticketRepository.findAll({sales: false});
		const allReservedTickets = allTickets.filter((item) => item.resevedBy = userInfo.name);
		const totalAmount = allReservedTickets.reduce((acc, item) => acc = item.price, 0);

		if (userInfo.count < totalAmount) {
			throw 'not enough money!';
		}

		const evenTickets = allReservedTickets.filter((item: Ticket) => item.sellingOption === SellingOption.even);
		const allTogetherTickets = allReservedTickets.filter((item: Ticket) => item.sellingOption === SellingOption.allTogether);
		const avoidOneTickets = allReservedTickets.filter((item: Ticket) => item.sellingOption === SellingOption.avoidOne);

		if (evenTickets.length && allReservedTickets.length % 2 !== 0) {
			throw 'count of the tickets is not even';
		}

		if (allTogetherTickets.length && allTogetherTickets.length !== allReservedTickets.length) {
			throw 'count of the tickets is max';
		}

		if (avoidOneTickets.length && allTickets.length - allReservedTickets.length === 1) {
			throw 'cant leave only 1 ticket available'
		}

		if (checkReservation(allReservedTickets)) {
			allReservedTickets.forEach((item: Ticket) => {
				item.reservedTime = null;
				item.sales = true;
			});
			const purchasedTickets = await this.ticketRepository.updateMany(allReservedTickets);
			userInfo.count -= totalAmount;
			await this.userService.updateOne(userInfo);
			return purchasedTickets;
		} else {
			throw 'reservation for some tickets expired';
		}
	}
}
