import { Controller,
	Patch,
	Get,
	Post,
	Body,
	ClassSerializerInterceptor,
	UseInterceptors,
	SerializeOptions,
	Param,
	Query,
	Delete,
	Put
} from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
	constructor(private readonly ticketService: TicketService) { }

	@Post()
	async create(@Body() ticket: any): Promise<any> {
		return await this.ticketService.create(ticket);
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<any> {
		return this.ticketService.delete(id);
	}

	@Get()
	async find(@Query('limit') limit?: number, @Query('offset') offset?: number): Promise<any[]> {
		return this.ticketService.findAll(limit, offset);
	}

	@Patch(':id')
	async reserve(@Body() ticket: any, @Param('id') id: string): Promise<any> {
		return this.ticketService.update(id, ticket);
	}

	@Post("buy")
	async buy(@Body() body: any): Promise<any> {
		return this.ticketService.buy(body);
	}

	@Post("reserveAll")
	async reserveAll(@Body() body: any): Promise<any> {
		return await this.ticketService.reserveAll(body);
	}

	@Post("reserveEven")
	async reserveEven(@Body() body: any): Promise<any> {
		return await this.ticketService.reserveEven(body);
	}

	@Post("reserveAvoidOne")
	async reserveAvoidOne(@Body() body: any): Promise<any> {
		return await this.ticketService.reserveAvoidOne(body);
	}
}
