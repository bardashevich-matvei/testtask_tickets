import {
	Controller,
	Get,
	Post,
	Body,
	ClassSerializerInterceptor,
	UseInterceptors,
	SerializeOptions,
	Param,
	Query,
	Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import UserResponseDto from '@libs/dtos/User/user-response.dto';
import CreateUserRequestDto from '@libs/dtos/User/create-user-request.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludeExtraneousValues: true })
export class UserController {
	constructor(private readonly userService: UserService) { }

	@Post()
	async create(@Body() user: CreateUserRequestDto): Promise<UserResponseDto> {
		return this.userService.create(user);
	}

	@Get()
	async find(@Query('limit') limit?: number, @Query('offset') offset?: number): Promise<UserResponseDto[]> {
		return this.userService.findAll(limit, offset);
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<UserResponseDto> {
		return this.userService.delete(id);
	}
}
