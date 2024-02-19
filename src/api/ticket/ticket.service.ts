import { BadRequestException, Injectable } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { UserService } from '../user/user.service';
import { Ticket } from './schemas/ticket.schema';
import { checkReservation } from '@app/utils/checkReservation.utils';
import { SellingOption } from '@libs/enums/SellingOptions.enum';
import TicketResponseDto from '@libs/dtos/Tickets/ticket-reposne.dto';

@Injectable()
export class TicketService {
	constructor(
		private readonly ticketRepository: TicketRepository,
		private readonly userService: UserService
	) { }

	async create(ticket: any): Promise<TicketResponseDto> {
		return this.ticketRepository.create(ticket);
	}

	async findAll(limit?: number, offset?: number): Promise<TicketResponseDto[]> {
		return this.ticketRepository.findAll(limit, offset);
	}

	async update(id: string, ticket: any): Promise<TicketResponseDto> {
		return this.ticketRepository.update(id, ticket);
	}

	async updateMany(tickets: any): Promise<TicketResponseDto[]> {
		return this.ticketRepository.updateMany(tickets);
	}

	async findOne(id: string): Promise<TicketResponseDto> {
		return this.ticketRepository.findOneById(id);
	}

	async delete(id: string): Promise<TicketResponseDto> {
		return this.ticketRepository.delete(id);
	}

	async reserve(body: any): Promise<any> {
		const { userName, ticketIds } = body;
		const userInfo = await this.userService.findOne(userName);
		const reservedTickets = await this.ticketRepository.findAll({_id: { $in: ticketIds}});

		const reservedInfo = {
			reservedTime: Date.now(),
			reservedBy: userInfo.name
		};
		const ticketsIds = reservedTickets.map((item: Ticket) => item._id );
		const filter = {_id: { $in: ticketsIds }};

		return await this.ticketRepository.updateMany(filter, reservedInfo);
	}

	async buy(body: any): Promise<TicketResponseDto[]> {
		const { userName } = body;
		const userInfo = await this.userService.findOne(userName);
		if (!userInfo) {
			throw new BadRequestException(`User not found!`);
		}
		
		const allTickets = await this.ticketRepository.findAll({sales: false});
		const allReservedTickets = allTickets.filter((item) => item.resevedBy = userInfo.name);
		const totalAmount = allReservedTickets.reduce((acc, item) => acc = item.price, 0);

		if (userInfo.count < totalAmount) {
			throw new BadRequestException('Not enough money!');
		}

		const evenTickets = allReservedTickets.filter((item: Ticket) => item.sellingOption === SellingOption.even);
		const allTogetherTickets = allReservedTickets.filter((item: Ticket) => item.sellingOption === SellingOption.allTogether);
		const avoidOneTickets = allReservedTickets.filter((item: Ticket) => item.sellingOption === SellingOption.avoidOne);

		if (evenTickets.length && allReservedTickets.length % 2 !== 0) {
			throw new BadRequestException('Count of the tickets is not even');
		}

		if (allTogetherTickets.length && allTogetherTickets.length !== allReservedTickets.length) {
			throw new BadRequestException('Count of the tickets is max');
		}

		if (avoidOneTickets.length && allTickets.length - allReservedTickets.length === 1) {
			throw new BadRequestException('Cant leave only 1 ticket available');
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
			throw new BadRequestException('Reservation for some tickets expired');
		}
	}
}
