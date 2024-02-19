import { Controller,
	Get,
	Post,
	Body,
	Param,
	Query,
	Delete,
	UseInterceptors,
	ClassSerializerInterceptor,
	SerializeOptions,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import TicketResponseDto from '@libs/dtos/Tickets/ticket-reposne.dto';

@Controller('tickets')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludeExtraneousValues: true })
export class TicketController {
	constructor(private readonly ticketService: TicketService) { }

	@Post()
	async create(@Body() ticket: any): Promise<TicketResponseDto> {
		return this.ticketService.create(ticket);
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<TicketResponseDto> {
		return this.ticketService.delete(id);
	}

	@Get()
	async find(@Query('limit') limit?: number, @Query('offset') offset?: number): Promise<TicketResponseDto[]> {
		return this.ticketService.findAll(limit, offset);
	}

	@Post("buy")
	async buy(@Body() body: any): Promise<TicketResponseDto[]> {
		return this.ticketService.buy(body);
	}

	@Post("reserve")
	async reserve(@Body() body: any): Promise<any> {
		return this.ticketService.reserve(body);
	}
}
