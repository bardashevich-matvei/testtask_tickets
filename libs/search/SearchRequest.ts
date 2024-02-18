// @ts-ignore
import { IsOptional, IsInt, IsBoolean } from 'class-validator';
// @ts-ignore
import { Type } from 'class-transformer';

export class SearchRequest {
    @IsInt()
    @IsOptional()
    offset?: number;

    @IsInt()
    @IsOptional()
    limit?: number;

    @IsBoolean()
    @IsOptional()
    descending?: boolean;
}