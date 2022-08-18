import { PrismaClient, TransactionType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		const prisma = new PrismaClient();
		const categories = await prisma.category.findMany();
		res.json(categories);
	}
}
