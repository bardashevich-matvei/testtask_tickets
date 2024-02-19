import { Ticket } from '@app/api/ticket/schemas/ticket.schema';
const TIME_FOR_RESERVATION = 900000; // 15mins

export function checkReservation(tickets: any): boolean {
	const countOfValidTickets = tickets.filter((item: Ticket) => Date.now() - item.reservedTime <= TIME_FOR_RESERVATION).length;
	return countOfValidTickets === tickets.length;
}