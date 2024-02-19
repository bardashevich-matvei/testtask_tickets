import { SellingOption } from '@libs/enums/SellingOptions.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket {
	@Prop({
		type: String,
		default: function genUUID() {
			return uuidv4();
		},
	})
	_id: string;

	@Prop({ require: true })
	name: string;

	@Prop({ require: true, default: "EUR" })
	currency: string;

	@Prop({ require: true })
	price: number;

	@Prop({ require: false })
	reservedTime?: number;

	@Prop({ require: false })
	reservedBy?: string;

	@Prop({ require: true })
	sellingOption: SellingOption;

	@Prop({ require: false, default: false })
	sales: boolean;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);