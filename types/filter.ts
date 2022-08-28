import { Type } from "@prisma/client";

export interface filters {
	count?: number;
	tags?: string[];
	search?: string;
	categories?: string[];
	type?: Type;
	account?: string;
	orderBy?: {
		field?: string;
		direction?: "asc" | "desc";
	};
	paginate?: {
		page: number;
		perPage: number;
	};
	amount?: {
		minAmount?: number;
		maxAmount?: number;
	};
	date?: {
		from: any;
		to: any;
	};
}
