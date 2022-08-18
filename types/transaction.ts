import { z } from "zod";
export interface Transaction {
	id: string;
	date: Date;
	type: string;
	category: Array<string>;
	debitAmount: number;
	description: string;
	creditAmount: number;
	closingBalance: number;
	narration?: string;
	reference?: string;
}

const transactionSchema = z.object({
	id: z.string(),
	date: z.date(),
	type: z.string(),
	category: z.string().array(),
	debitAmount: z.number(),
	description: z.string(),
	creditAmount: z.number(),
	closingBalance: z.number(),
	narration: z.string().optional(),
	reference: z.string().optional(),
});

export const TransactionTypes = [
	"UNKNOWN",
	"INCOME",
	"EXPENSE",
	"LENDING",
	"BORROWING",
	"MIDDLE_ACCOUNT_AMOUNT_TRANSFER",
	"TALLY_LENDING",
	"TALLY_BORROWING",
	"TALLY_MIDDLE_ACCOUNT_AMOUNT_TRANSFER",
];
