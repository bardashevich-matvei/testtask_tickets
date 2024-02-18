// @ts-ignore
import { IsOptional, ValidateNested, IsArray, IsInt, IsString, IsBoolean, IsEnum } from 'class-validator';
// @ts-ignore
import { Type } from 'class-transformer';
import { Operation } from '@libs/enums/operations.enum';

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