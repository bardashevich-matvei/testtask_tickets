import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = User & Document;

@Schema()
export class User {
	@Prop({
		type: String,
		default: function genUUID() {
			return uuidv4();
		},
	})
	_id: string;

	@Prop({ require: true })
	name: string;

	@Prop({ require: true })
	count: number;

	@Prop({ require: true, default: "EUR" })
	currency: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
