// @ts-ignore
import { Expose, Transform } from 'class-transformer';

export default class UserResponseDto {
    @Expose()
    @Transform( ({ obj }: { obj: { _id: string }}) => obj._id)
    id: string;

    @Expose()
    name: string;

	@Expose()
    count: number;

	@Expose()
    currency: string;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
  }