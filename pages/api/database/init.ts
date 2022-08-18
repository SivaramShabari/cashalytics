import { PrismaClient, Transaction } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		const prisma = new PrismaClient();
		const transactions: Transaction[] = [];
		transactions.push();
		prisma.transaction.createMany({ data: transactions });
	}
}
