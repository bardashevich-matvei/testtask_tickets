// @ts-ignore
import { SellingOption } from '@libs/enums/SellingOptions.enum';
import { Expose, Transform } from 'class-transformer';

export default class TicketResponseDto {
    @Expose()
    @Transform( ({ obj }: { obj: { _id: string }}) => obj._id)
    id: string;

    @Expose()
    name: string;

	@Expose()
    price: number;

	@Expose()
    currency: string;

	@Expose()
    sales: boolean;

	@Expose()
    reservedTime?: number;

	@Expose()
    reservedBy?: string;

	@Expose()
    sellingOption: SellingOption;

    constructor(partial: Partial<TicketResponseDto>) {
        Object.assign(this, partial);
    }
}