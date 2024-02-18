// @ts-ignore
import { Expose, Transform } from 'class-transformer';

export default class UserResponseDto {
    @Expose()
    @Transform( ({ obj }: { obj: { _id: string }}) => obj._id)
    id: string;

    @Expose()
    login: string;
  
    @Expose()
    password: string;
  
    @Expose()
    name?: string;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
  }