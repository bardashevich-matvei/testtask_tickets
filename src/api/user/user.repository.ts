import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import UserResponseDto from '@libs/dtos/User/user-response.dto';
import CreateUserRequestDto from '@libs/dtos/User/create-user-request.dto';
import { SearchRequest } from '@libs/search/SearchRequest';
import { mapSearchRequestForMongo } from '@app/utils/search.utils';

@Injectable()
export class UserRepository {
	constructor(
		@InjectModel(User.name)
		private userModel: Model<User>,
	) { }

	async create(user: CreateUserRequestDto): Promise<UserResponseDto> {
		const savedUser = new this.userModel(user);
		await savedUser.save();
		return new UserResponseDto(savedUser.toObject());
	}

	async findAll(filter?: any, limit?: number, offset?: number): Promise<UserResponseDto[]> {
		const selector: SearchRequest = { limit: limit, offset: offset };
		const { queryOptions } = mapSearchRequestForMongo(selector);

		return (await this.userModel.find(filter, null, queryOptions).lean().exec()).map(
			(item) => new UserResponseDto(item),
		);
	}


	async delete(id: string): Promise<UserResponseDto> {
		const deletedUser = await this.userModel.findByIdAndRemove(id).lean().exec();
		return new UserResponseDto(deletedUser || {});
	}

	async findOneByName(name: string): Promise<UserResponseDto> {
		const user = await this.userModel.findOne({name: name}).lean().exec();
		return new UserResponseDto(user || {});
	}

	async updateOne(user: User): Promise<any> {
		const updatedUser = await this.userModel.updateOne({name: user.name}, { $set: { count: user.count}}).lean().exec();
		return updatedUser || {};
	}
}
