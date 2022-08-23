import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { filters } from "../../../types/filter";
import prisma from "../prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const session = await getSession({ req });
		if (!session) {
			console.log("No session in category/all");
			res.status(401).json({ message: "Unauthorized" });
		} else {
			if (req.method === "GET") {
				const queries = req.query;
				let filters: filters = {
					tags: undefined,
					paginate: { page: 1, perPage: 30 },
					search: undefined,
					type: undefined,
					orderBy: undefined,
					amount: {
						minAmount: undefined,
						maxAmount: undefined,
					},
					date: {
						from: undefined,
						to: undefined,
					},
				};
				if (queries.search) filters.search = queries.search as string;
				if (queries.page) filters.paginate!.page = Number(queries.page);
				if (queries.perPage)
					filters.paginate!.perPage = Number(queries.perPage);
				if (queries.tags) filters.tags = (queries.tags as string).split(",");
				if (queries.type) filters.type = queries.type as "Credit" | "Debit";
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
				if (queries.from || queries.to) {
					filters["date"] = {
						from: new Date((queries.from as string) || ""),
						to: new Date((queries.to as string) || ""),
					};
				}
				let where: any = {};
				if (filters.type) where.type = { equals: filters.type };
				if (filters.tags) where.tags = { in: filters.tags };
				if (filters.search)
					where.OR = [
						{ description: { contains: filters.search.toString().trim() } },
						{ narration: { contains: filters.search.toString().trim() } },
						{ reference: { contains: filters.search.toString().trim() } },
					];
				if (filters.date?.from && filters.date?.to) {
					where.date = {
						gte: new Date(filters.date.from),
						lte: new Date(filters.date.to),
					};
				}
				if (filters.amount?.maxAmount && filters.amount.minAmount)
					where.amount = {
						gte: filters.amount.minAmount,
						lte: filters.amount.maxAmount,
					};
				console.log("where :", where);
				prisma.$connect;
				const user = await prisma.user.findUnique({
					where: { email: session.user?.email || "" },
				});
				if (!user) throw new Error("Invalid user");
				const transactions = await prisma.transaction.findMany({
					orderBy: filters.orderBy?.field
						? {
								[filters.orderBy.field || "date"]:
									filters.orderBy.direction || "desc",
						  }
						: undefined,
					where: {
						...where,
						userId: {
							equals: user.id,
						},
					},
					take: filters.paginate?.perPage || filters.count,
					skip:
						filters.paginate &&
						(filters.paginate.page - 1) * filters.paginate.perPage,
				});
				const count = await prisma.transaction.count();
				prisma.$disconnect();
				res.status(200).json({ transactions, count });
			}
		}
	} catch (error) {
		console.log("Error:", error);
		prisma.$disconnect();
		res.status(500).json({ error });
	}
}
