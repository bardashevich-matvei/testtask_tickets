import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TicketRepository } from './ticket.repository';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import TicketResponseDto from '@libs/dtos/Tickets/ticket-reposne.dto';
import { throwError } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { error } from 'console';

describe('TicketController', () => {
	let ticketController: TicketController;
	let ticketService: TicketService;
	let ticketModule: TestingModule;

	beforeAll(async () => {
		ticketModule = await Test.createTestingModule({
			imports: [
				MongooseModule.forFeature([
					{ name: Ticket.name, schema: TicketSchema },
					{ name: User.name, schema: UserSchema }
				]),
				MongooseModule.forRoot('mongodb://127.0.0.1:27017/Tickets')
			],
			controllers: [TicketController],
			providers: [TicketService, TicketRepository, UserService, UserRepository],
		}).compile();
	
		ticketService = ticketModule.get<TicketService>(TicketService);
		ticketController = ticketModule.get<TicketController>(TicketController);
	});
	
	describe('findAll', () => {
		it('should return an array of tickets', async () => {
			const result = [{
				id: "46aca4d1-6734-46a2-9784-ea06f10d2c05",
				name: "ticket6",
				price: 300,
				currency: "EUR",
				sales: false,
				sellingOption: "even"
			} as TicketResponseDto];
			jest.spyOn(ticketService, 'findAll').mockImplementation(async () => result);
	
			expect(await ticketController.find()).toBe(result);
		});
	});

	describe('reserveAll', () => {
		it('should return an info', async () => {
			const result = [{
				"acknowledged": true,
				"modifiedCount": 1,
				"upsertedId": null,
				"upsertedCount": 0,
				"matchedCount": 1
			}];
			const body = {
				user: "user",
				ticketIds: ["46aca4d1-6734-46a2-9784-ea06f10d2c05"]
			};
			jest.spyOn(ticketService, 'reserve').mockImplementation(async () => result);

			expect(await ticketController.reserve(body)).toBe(result);
		});
	});

	describe('buyAll', () => {
		it('should return an error', async () => {
			const body = {
				user: "user",
				ticketIds: ["46aca4d1-6734-46a2-9784-ea06f10d2c05"]
			};
			try {
				jest.spyOn(ticketService, 'buy').mockImplementation(async () => {
					throw new BadRequestException('Count of the tickets is not even');
				});
			} catch(error) {
				expect(await ticketController.buy(body)).toThrow(error);
			}
		});
	});

	afterAll(async () => {
		ticketModule.close();
	});
});