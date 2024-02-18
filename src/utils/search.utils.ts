import { SearchRequest } from '@libs/search/SearchRequest';
import { FilterQuery, QueryOptions } from 'mongoose';

const requestForbidenChar = '()+[*';
const OPERATIONS = {
	and: '$and',
	or: '$or',
};

const normalizeSearchRegExp = (value: string) => {
	return value
		.split('')
		.map((char) => {
			if (requestForbidenChar.includes(char)) {
				return `\\${char}`;
			}
			if (char === '\\') {
				return '(.*)';
			}
			return char;
		})
		.join('');
};

export function mapSearchRequestForMongo(searchModel: SearchRequest) {
	const queryOptions: QueryOptions = {
		limit: searchModel.limit || 10,
		skip: searchModel.offset || 0,
	};

	const filterQuery: FilterQuery<unknown> = {};

	if (searchModel.stringFilters) {
		let operation: string;
		if (!searchModel.operation) {
			operation = OPERATIONS.or;
		} else {
			operation = OPERATIONS[searchModel.operation];
		}
		searchModel.stringFilters.forEach((item) => {
			filterQuery[operation] = filterQuery[operation] || [];
			filterQuery[operation].push({
				[item.fieldName]: {
					$in: item.values.map((value) => {
						if (item.exactMatch) {
							return value;
						}
						return new RegExp(normalizeSearchRegExp(value), 'i');
					}),
				},
			});
		});
	}

	return {
		queryOptions,
		filterQuery,
	};
}