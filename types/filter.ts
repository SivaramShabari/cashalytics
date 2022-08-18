import { TransactionType } from "@prisma/client";

export interface filters {
	count?: number;
	paginate?: {
		page: number;
		perPage: number;
	};
	category?: string;
	search?: string;
	orderBy?: {
		field: string;
		direction: "asc" | "desc";
	};
	amount?: {
		minAmount: number;
		maxAmount: number;
	};
	categories?: string[];
	type?: TransactionType;
	date?: {
		from: Date;
		to: Date;
	};
}
