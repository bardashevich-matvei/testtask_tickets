import { Injectable } from '@nestjs/common';
import UserResponseDto from '@libs/dtos/User/user-response.dto';
import CreateUserRequestDto from '@libs/dtos/User/create-user-request.dto';
import { UserRepository } from './user.repository';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) { }

	async create(movie: CreateUserRequestDto): Promise<UserResponseDto> {
		return this.userRepository.create(movie);
	}

	async findAll(limit?: number, offset?: number): Promise<UserResponseDto[]> {
		return this.userRepository.findAll(limit, offset);
	}

	async delete(id: string): Promise<UserResponseDto> {
		return this.userRepository.delete(id);
	}

	async findOne(name: string): Promise<UserResponseDto> {
		return this.userRepository.findOneByName(name);
	}

	async updateOne(user: any): Promise<any> {
		return this.userRepository.updateOne(user);
	}
}
