import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { filters } from "../../../types/filter";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		const prisma = new PrismaClient();
		const queries = req.query;
		let filters: filters = {
			categories: [],
			paginate: { page: 1, perPage: 100 },
		};
		if (queries.count) filters.count = Number(queries.count);
		if (queries.search) filters.search = queries.search as string;
		if (queries.page) filters.paginate!.page = Number(queries.page);
		if (queries.perPage) filters.paginate!.perPage = Number(queries.perPage);
		if (queries.orderBy)
			filters.orderBy = {
				field: queries.orderBy as string,
				direction: queries.direction as "asc" | "desc",
			};
		if (queries.amount) {
			filters.amount = {
				minAmount: Number(queries.minAmount),
				maxAmount: Number(queries.maxAmount),
			};
		}
		if (queries.categories)
			filters.categories = (queries.categories as string).split(",");
		if (queries.category)
			filters.categories = [
				...(filters.categories as string[]),
				queries.category as string,
			];
		if (queries.date) {
			filters.date = {
				from: new Date(queries.from as string),
				to: new Date(queries.to as string),
			};
		}
		const transactions = await prisma.transaction.findMany({
			orderBy: {
				[filters.orderBy?.field || "date"]:
					filters.orderBy?.direction || "desc",
			},
			where: {},
			take: filters.paginate?.perPage || filters.count,
			skip:
				filters.paginate &&
				(filters.paginate.page - 1) * filters.paginate.perPage,
		});
		res.status(200).json(transactions);
	}
}
