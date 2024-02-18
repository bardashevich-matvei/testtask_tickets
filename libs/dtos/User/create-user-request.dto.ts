// @ts-ignore
import { IsString, IsInt } from 'class-validator';

export default class CreateUserRequestDto {
  @IsString()
  name: string;

  @IsInt()
  count: number;
}