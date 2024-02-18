// @ts-ignore
import { IsString, IsOptional } from 'class-validator';

export default class CreateUserRequestDto {
  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}