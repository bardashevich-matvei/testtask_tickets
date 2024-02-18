// @ts-ignore
import { IsBoolean,  IsString, IsArray} from 'class-validator';

export class StringFilter {
    @IsString()
    fieldName: string;

    @IsBoolean()
    exactMatch: boolean;

    @IsArray()
    @IsString({ each: true })
    values: Array<string>;
}