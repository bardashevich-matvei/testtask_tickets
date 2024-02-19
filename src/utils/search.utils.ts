import { SearchRequest } from '@libs/search/SearchRequest';
import { QueryOptions } from 'mongoose';

export function mapSearchRequestForMongo(searchModel: SearchRequest) {
	const queryOptions: QueryOptions = {
		limit: searchModel.limit || 10,
		skip: searchModel.offset || 0,
	};

	return {
		queryOptions
	};
}